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

// ... (código existente hasta la línea 27)

// --- RUTAS CRUD: Aquí es donde agregaremos la Lógica de DB (Paso 3) ---

// 1. OBTENER todos los hábitos: Consultar todos los registros
app.get("/api/habits", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM habits ORDER BY id");
    res.json(result.rows); // Envía la lista de hábitos como respuesta
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al consultar los hábitos.");
  }
});

// 2. CREAR un nuevo hábito
app.post("/api/habits", async (req, res) => {
  const { name } = req.body;
  try {
    // Inserta un nuevo hábito con 'completed' en FALSE por defecto
    const result = await pool.query(
      "INSERT INTO habits (name, completed) VALUES ($1, FALSE) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear el hábito.");
  }
});

// 3. ACTUALIZAR el estado de un hábito (PUT)
app.put("/api/habits/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  // Espera recibir { completed: true/false }
  const { completed } = req.body;
  try {
    const result = await pool.query(
      "UPDATE habits SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Hábito no encontrado.");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al actualizar el hábito.");
  }
});

// 4. ELIMINAR un hábito (DELETE)
app.delete("/api/habits/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "DELETE FROM habits WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Hábito no encontrado.");
    }
    res.json({ message: "Hábito eliminado", id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar el hábito.");
  }
});

// 5. RESETEAR todos los hábitos (Marcar todos como NO completados)
app.post("/api/habits/reset", async (req, res) => {
  try {
    await pool.query("UPDATE habits SET completed = FALSE");
    res.json({ message: "Hábitos reseteados" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al resetear los hábitos.");
  }
});

// ... (código existente de app.listen)
