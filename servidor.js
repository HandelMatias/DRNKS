// servidor.js
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const cors    = require('cors');

const app     = express();
// Ahora toma el puerto de la variable de entorno o usa 3000 por defecto
const PORT    = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'faces.json');

// -- Middlewares --
app.use(cors());
app.use(express.json());

// 1) Servir todo el contenido de la carpeta ./Drinks como archivos estáticos
app.use(express.static(path.join(__dirname, 'Drinks')));

// 2) Asegurarnos de que faces.json exista
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '{}', 'utf8');
}

// Helpers para leer/guardar la "base de datos"
function loadDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// -- Rutas de la API --

// Ruta raíz: siempre entrega Drinks/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Drinks', 'index.html'));
});

// POST /api/guardar-face
app.post('/api/guardar-face', (req, res) => {
  const { nombre, face_token } = req.body;
  if (!nombre || !face_token) {
    return res.status(400).json({ error: 'Nombre y face_token son requeridos' });
  }

  const db = loadDB();
  db[nombre] = face_token;
  saveDB(db);

  return res.json({ success: true, message: `Rostro registrado para ${nombre}` });
});

// GET /api/rostros  (para debug: lista todos los registrados)
app.get('/api/rostros', (req, res) => {
  return res.json(loadDB());
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

