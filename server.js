// Importar módulos necesarios
const express = require("express");
const path = require("path");

// Inicializar la aplicación Express
const app = express();

// **Configuración del Puerto para Despliegue en la Nube (Railway/Render)**
// Railway asigna un puerto a través de process.env.PORT. Usamos 3000 como fallback local.
const PORT = process.env.PORT || 3000;

// ====================================================================
// 1. SERVIR ARCHIVOS ESTÁTICOS (CSS, JS del cliente, imágenes)
// ====================================================================
// Esto le dice a Express que use la carpeta actual (__dirname) para buscar archivos estáticos.
// Si tus archivos estuvieran en una carpeta llamada 'public', sería:
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// ====================================================================
// 2. DEFINIR RUTA RAÍZ (SERVIR INDEX.HTML)
// ====================================================================
// Cuando el usuario accede a la ruta principal ( / ), enviamos el archivo index.html
app.get("/", (req, res) => {
  // path.join() construye una ruta segura al archivo index.html
  res.sendFile(path.join(__dirname, "index.html"));
});

// ====================================================================
// 3. INICIAR EL SERVIDOR
// ====================================================================
app.listen(PORT, () => {
  // Este mensaje aparecerá en tus logs de Railway si el servidor se inicia
  console.log(`✅ Servidor Express corriendo en el puerto ${PORT}`);
});
