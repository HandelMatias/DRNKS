// public/Drinks/script.js

// Configuración Face++
const API_KEY    = 'P0748sYK5BaRMRIxiOujjiaKyJ8q8a0c';
const API_SECRET = 'rL4QOEMoOtj0ZIAI-BZvqzY35ygHjl3s';
const FACESET_ID = 'my_faceset';

// ✅ URL del backend desplegado en Railway
const BACKEND_URL = 'https://drnks-production.up.railway.app';

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

// --- Registro de rostro ---
async function registerFace() {
  setButtonsState(false);
  showMessage('Registrando rostro…');
  try {
    // 1) Detectar en Face++
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
    if (!data1.faces?.length) {
      showMessage('No se detectó ningún rostro.');
      return;
    }

    // 2) Añadir al FaceSet
    registeredFaceToken = data1.faces[0].face_token;
    form = new FormData();
    form.append('api_key', API_KEY);
    form.append('api_secret', API_SECRET);
    form.append('outer_id', FACESET_ID);
    form.append('face_tokens', registeredFaceToken);
    await fetch('https://api-us.faceplusplus.com/facepp/v3/faceset/addface', {
      method: 'POST', body: form
    });

    // 3) Pedir nombre y guardar en backend
    const nombre = prompt('Ingresa tu nombre para registrar el rostro:');
    if (!nombre) {
      showMessage('Registro cancelado: no ingresaste un nombre.');
      return;
    }
    const resp2 = await fetch(`${BACKEND_URL}/api/guardar-face`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, face_token: registeredFaceToken })
    });
    const result = await resp2.json();
    if (result.success) {
      showMessage(`¡Rostro registrado como ${nombre}!`);
    } else {
      showMessage('Error al guardar en el servidor.');
    }

  } catch (e) {
    console.error(e);
    showMessage('Error al registrar el rostro.');
  } finally {
    setButtonsState(true);
  }
}

// --- Helper: asegurarse de tener el token desde el backend ---
async function loadTokenFromServer() {
  if (registeredFaceToken) return true;

  const nombre = prompt('Ingresa tu nombre para iniciar sesión:');
  if (!nombre) {
    showMessage('Inicio cancelado: no ingresaste un nombre.');
    return false;
  }

  try {
    const resp = await fetch(`${BACKEND_URL}/api/rostros`);
    const db   = await resp.json();

    if (!db[nombre]) {
      showMessage('Usuario no encontrado. Primero regístrate.');
      return false;
    }

    registeredFaceToken = db[nombre];
    return true;

  } catch (e) {
    console.error(e);
    showMessage('Error al contactar el servidor.');
    return false;
  }
}

// --- Inicio de sesión facial ---
async function loginFace() {
  const ok = await loadTokenFromServer();
  if (!ok) return;

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

