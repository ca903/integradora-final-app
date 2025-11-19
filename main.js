// main.js (CÓDIGO MODIFICADO PARA USAR LA API)

const API_URL = "/api/habits";

// --- Funciones de comunicación con el Backend (DB) ---

async function fetchHabits() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener hábitos");
  return response.json();
}

async function updateHabitOnServer(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
}

async function deleteHabitOnServer(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}

async function addHabitToServer(name) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

async function resetHabitsOnServer() {
  await fetch(`${API_URL}/reset`, {
    method: "POST",
  });
}

// --- Lógica del Frontend (Renderizado) ---

function updateStats(habits) {
  const total = habits.length;
  const completed = habits.filter((h) => h.completed).length;
  // Usamos Math.round para evitar errores de punto flotante en toFixed
  const percent =
    total > 0 ? Math.round((completed / total) * 100).toFixed(0) : 0;
  document.getElementById(
    "stats"
  ).textContent = `Progreso diario: ${percent}% (${completed}/${total})`;
}

async function renderHabits() {
  try {
    const habits = await fetchHabits(); // Obtener hábitos del servidor
    const habitList = document.getElementById("habit-list");
    habitList.innerHTML = "";

    habits.forEach((habit) => {
      const habitDiv = document.createElement("div");
      habitDiv.className = "habit";

      const label = document.createElement("label");
      label.textContent = habit.name;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = habit.completed;
      checkbox.addEventListener("change", async () => {
        await updateHabitOnServer(habit.id, checkbox.checked);
        await renderHabits();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.addEventListener("click", async () => {
        await deleteHabitOnServer(habit.id);
        await renderHabits();
      });

      habitDiv.appendChild(label);
      habitDiv.appendChild(checkbox);
      habitDiv.appendChild(deleteBtn);
      habitList.appendChild(habitDiv);
    });

    updateStats(habits);
  } catch (error) {
    console.error("No se pudo conectar al servidor de la API.", error);
    document.getElementById("stats").textContent =
      "Error de conexión con el servidor.";
  }
}

async function addHabit() {
  const input = document.getElementById("new-habit");
  const name = input.value.trim();
  if (name !== "") {
    await addHabitToServer(name);
    input.value = "";
    await renderHabits();
  }
}

async function resetHabits() {
  await resetHabitsOnServer();
  await renderHabits();
}

document.addEventListener("DOMContentLoaded", () => {
  renderHabits();

  document.getElementById("add-habit").addEventListener("click", addHabit);
  document.getElementById("reset").addEventListener("click", resetHabits);
});
