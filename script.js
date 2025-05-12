// Configuración Face++ (cliente)
const API_KEY    = 'P0748sYK5BaRMRIxiOujjiaKyJ8q8a0c';
const API_SECRET = 'rL4QOEMoOtj0ZIAI-BZvqzY35ygHjl3s';
const FACESET_ID = 'my_faceset';

let registeredFaceToken = null;

// DOM
const video       = document.getElementById('video');
const registerBtn = document.getElementById('registerBtn');
const loginBtn    = document.getElementById('loginBtn');
const messageDiv  = document.getElementById('message');

// Inicia cámara
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (e) {
    showMessage('Error al acceder a la cámara.');
    console.error(e);
  }
}

// Muestra mensaje
function showMessage(txt) {
  messageDiv.textContent = txt;
}

// Habilita/deshabilita botones
function setButtonsState(enabled) {
  registerBtn.disabled = !enabled;
  loginBtn.disabled    = !enabled;
}

// Registrar rostro
async function registerFace() {
  setButtonsState(false);
  showMessage('Registrando rostro…');
  try {
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const img64 = canvas.toDataURL('image/jpeg').split(',')[1];

    let form = new FormData();
    form.append('api_key', API_KEY);
    form.append('api_secret', API_SECRET);
    form.append('image_base64', img64);
    const resp1 = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
      method: 'POST', body: form
    });
    const data1 = await resp1.json();

    if (data1.faces?.length) {
      registeredFaceToken = data1.faces[0].face_token;
      form = new FormData();
      form.append('api_key', API_KEY);
      form.append('api_secret', API_SECRET);
      form.append('outer_id', FACESET_ID);
      form.append('face_tokens', registeredFaceToken);
      await fetch('https://api-us.faceplusplus.com/facepp/v3/faceset/addface', {
        method: 'POST', body: form
      });
      showMessage('¡Rostro registrado!');
    } else {
      showMessage('No se detectó ningún rostro.');
    }
  } catch (e) {
    console.error(e);
    showMessage('Error al registrar el rostro.');
  } finally {
    setButtonsState(true);
  }
}

// Iniciar sesión facial
async function loginFace() {
  if (!registeredFaceToken) {
    showMessage('Primero registra tu rostro.');
    return;
  }
  setButtonsState(false);
  showMessage('Verificando…');
  try {
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const img64 = canvas.toDataURL('image/jpeg').split(',')[1];

    const form = new FormData();
    form.append('api_key', API_KEY);
    form.append('api_secret', API_SECRET);
    form.append('image_base64', img64);
    form.append('outer_id', FACESET_ID);
    const resp2 = await fetch('https://api-us.faceplusplus.com/facepp/v3/search', {
      method: 'POST', body: form
    });
    const data2 = await resp2.json();

    if (data2.results?.length && data2.results[0].face_token === registeredFaceToken) {
      // Redirige a la sección de cocteles
      window.location.href = './cocktails/cocktails_index.html';
    } else {
      showMessage('Rostro no reconocido.');
    }
  } catch (e) {
    console.error(e);
    showMessage('Error al verificar el rostro.');
  } finally {
    setButtonsState(true);
  }
}

// Eventos y arranque
registerBtn.onclick = registerFace;
loginBtn.onclick    = loginFace;
startCamera();

