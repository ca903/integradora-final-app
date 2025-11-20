// Importar módulos
const express = require("express");
const path = require("path");
const { Pool } = require("pg"); // Importar el cliente de PostgreSQL

// Inicializar la aplicación Express
const app = express();

// Middleware para procesar JSON (necesario para rutas POST/PUT)
app.use(express.json());

// **Configuración Crucial del Puerto para Despliegue en la Nube**
const PORT = process.env.PORT || 3000;

// ====================================================================
// 🔑 CONFIGURACIÓN DE LA BASE DE DATOS (POSTGRESQL)
// ====================================================================

const pool = new Pool({
  // Usa la variable de entorno DATABASE_URL
  connectionString: process.env.DATABASE_URL,

  // **IMPORTANTE:** Configuración SSL necesaria para conexiones desde Render
  ssl: {
    rejectUnauthorized: false,
  },
});

// Prueba de conexión a la base de datos (Se ejecuta una vez al iniciar el servidor)
pool.connect((err, client, release) => {
  if (err) {
    // Si hay un error aquí, Render mostrará el error específico en los logs
    console.error("❌ Error al conectar a PostgreSQL:", err.stack);
    // Nota: No retornamos el error aquí, ya que queremos que Express inicie para servir archivos estáticos.
  } else {
    release(); // Libera el cliente
    console.log("✅ Conexión exitosa a PostgreSQL");
  }
});

// ====================================================================
// 1. SERVIR ARCHIVOS ESTÁTICOS Y RUTA RAÍZ
// ====================================================================

// Esto le dice a Express que sirva archivos estáticos (CSS, JS, imágenes) desde la carpeta raíz.
app.use(express.static(__dirname));

// Ruta raíz para servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ====================================================================
// 2. RUTAS API PARA LA LÓGICA DE HÁBITOS (SOLUCIÓN DEL ERROR)
// ====================================================================

// 1. RUTA GET: Obtener todos los hábitos
app.get("/api/habitos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM habitos ORDER BY id");
    // Envía los datos de la DB al frontend
    res.json(result.rows);
  } catch (err) {
    // Captura errores de la DB y notifica al frontend
    console.error("Error al obtener hábitos:", err.message);
    res
      .status(500)
      .json({
        error: "Error interno del servidor al consultar la base de datos.",
      });
  }
});

// 2. RUTA POST: Agregar un nuevo hábito
app.post("/api/habitos", async (req, res) => {
  const { nombre } = req.body; // Obtiene el nombre del cuerpo de la solicitud
  try {
    const queryText = "INSERT INTO habitos (nombre) VALUES ($1) RETURNING *";
    const result = await pool.query(queryText, [nombre]);
    // Envía el nuevo registro creado de vuelta
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear hábito:", err.message);
    res
      .status(500)
      .json({ error: "Error interno del servidor al crear el hábito." });
  }
});

// ====================================================================
// 3. INICIAR EL SERVIDOR
// ====================================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});
