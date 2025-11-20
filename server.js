// Importar módulos
const express = require("express");
const path = require("path");
const { Pool } = require("pg"); // Importar el cliente de PostgreSQL

// Inicializar la aplicación Express
const app = express();

// Middleware para procesar JSON (necesario para rutas POST/PUT)
app.use(express.json());

// ====================================================================
// 1. RUTAS API Y DE PRUEBA (Mover a la parte superior) ⬅️
// ====================================================================

// Ruta de prueba de conexión de Express (Para debugging)
app.get("/test", (req, res) => {
  res.status(200).json({ status: "Express Server is UP!" });
});

// 1. RUTA GET: Obtener todos los hábitos
app.get("/api/habitos", async (req, res) => {
  try {
    // CAMBIO CRUCIAL AQUÍ: Simplificar la consulta.
    const result = await pool.query("SELECT * FROM habitos"); 
    // Envía los datos de la DB al frontend
    res.json(result.rows);
  } catch (err) {
// ... el código de manejo de error se queda igual.

// 2. RUTA POST: Agregar un nuevo hábito
app.post("/api/habitos", async (req, res) => {
  const { nombre } = req.body; // Obtiene el nombre del cuerpo de la solicitud
  try {
    const queryText = "INSERT INTO habitos (nombre) VALUES ($1) RETURNING *";
    const result = await pool.query(queryText, [nombre]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear hábito:", err.message);
    res
      .status(500)
      .json({ error: "Error interno del servidor al crear el hábito." });
  }
});

// ====================================================================
// 2. CONFIGURACIÓN DE PUERTO Y BASE DE DATOS
// ====================================================================
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Prueba de conexión a la base de datos (Se ejecuta una vez al iniciar el servidor)
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error al conectar a PostgreSQL:", err.stack);
  } else {
    release(); // Libera el cliente
    console.log("✅ Conexión exitosa a PostgreSQL");
  }
});

// ====================================================================
// 3. SERVIR ARCHIVOS ESTÁTICOS Y RUTA RAÍZ (DEBE IR AL FINAL PARA CAPTURAR TODO LO DEMÁS) ⬅️
// ====================================================================

// Esto le dice a Express que sirva archivos estáticos (CSS, JS, imágenes) desde la carpeta raíz.
app.use(express.static(__dirname));

// Ruta raíz para servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ====================================================================
// 4. INICIAR EL SERVIDOR (DEBE IR AL FINAL)
// ====================================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});
