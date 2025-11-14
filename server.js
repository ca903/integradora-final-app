const express = require("express");
const { Pool } = require("pg");
const path = require("path"); // Módulo para manejar rutas de archivos

const app = express();
// Usa el puerto 3000 localmente, o el puerto que asigne la plataforma (Railway/Render)
const port = process.env.PORT || 3000;

// Middleware para procesar cuerpos de solicitud en formato JSON
app.use(express.json());

// --- CONFIGURACIÓN DE CONEXIÓN A POSTGRESQL ---
// La aplicación usará la variable de entorno DATABASE_URL en el despliegue.
// Localmente, usaremos una cadena de conexión local (Asegúrate de que 'user' y 'password' sean los de tu PostgreSQL local)
const pool = new Pool({
  // ASEGÚRATE DE CAMBIAR 'user' y 'password' si son diferentes en tu máquina.
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://user:password@localhost:5432/habitsdb",
});

// --- SERVIR ARCHIVOS ESTÁTICOS (Frontend) ---
// Esto le dice a Express que sirva todos los archivos (index.html, main.js, style.css)
// desde la misma carpeta donde está server.js.
app.use(express.static(path.join(__dirname)));

// --- RUTAS CRUD: Aquí es donde agregaremos la lógica de DB (Paso 3) ---
// app.get('/api/habits', ...);
// app.post('/api/habits', ...);
// ...

// --- INICIAR EL SERVIDOR ---
app.listen(port, () => {
  console.log(`Servidor de hábitos corriendo en http://localhost:${port}`);
});
