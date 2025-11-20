// Importar módulos
const express = require("express");
const path = require("path");
const { Pool } = require("pg"); // Importar el cliente de PostgreSQL

// Inicializar la aplicación Express
const app = express();

// Middleware para procesar JSON (si usas POST/PUT)
app.use(express.json());

// **Configuración Crucial del Puerto para Despliegue en la Nube**
// Usa el puerto proporcionado por Render o 3000 localmente.
const PORT = process.env.PORT || 3000;

// ====================================================================
// 🔑 CONFIGURACIÓN DE LA BASE DE DATOS (POSTGRESQL)
// ====================================================================

const pool = new Pool({
  // Usa la variable de entorno DATABASE_URL que configuraste en Render
  connectionString: process.env.DATABASE_URL,

  // **IMPORTANTE:** Configuración SSL necesaria para conexiones desde Render a PostgreSQL
  ssl: {
    rejectUnauthorized: false,
  },
});

// Prueba de conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    // Si hay un error aquí, es la razón del "Error de conexión con el servidor."
    console.error("❌ Error al conectar a PostgreSQL:", err.stack);
    return;
  }
  release(); // Libera el cliente
  console.log("✅ Conexión exitosa a PostgreSQL");
});

// ====================================================================
// 1. SERVIR ARCHIVOS ESTÁTICOS Y RUTA RAÍZ
// ====================================================================

// Esto le dice a Express que sirva archivos estáticos (CSS, JS, imágenes) desde la carpeta raíz.
app.use(express.static(__dirname));

// Ruta raíz para servir index.html
app.get("/", (req, res) => {
  // Asegúrate de que index.html está en la misma carpeta que server.js
  res.sendFile(path.join(__dirname, "index.html"));
});

// --------------------------------------------------------------------
// (TUS RUTAS API PARA LA LÓGICA DE HÁBITOS DEBEN IR AQUÍ ABAJO)
// Si la aplicación fallaba antes, es posible que estas rutas no se estuvieran
// ejecutando por el error de conexión.
// --------------------------------------------------------------------
/*
// Ejemplo de ruta de API que usa la base de datos:
app.get('/api/habitos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM habitos ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener hábitos:", err.message);
        res.status(500).send("Error del servidor al obtener datos.");
    }
});
*/

// ====================================================================
// 2. INICIAR EL SERVIDOR
// ====================================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});
