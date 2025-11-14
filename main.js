let habits = [];

function loadHabits() {
  const saved = JSON.parse(localStorage.getItem("habits"));
  habits = saved || [
    { name: "Beber 2L de agua", completed: false },
    { name: "Hacer ejercicio", completed: false },
    { name: "Leer 20 minutos", completed: false },
  ];
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function updateStats() {
  const total = habits.length;
  const completed = habits.filter((h) => h.completed).length;
  const percent = total > 0 ? ((completed / total) * 100).toFixed(0) : 0;
  document.getElementById(
    "stats"
  ).textContent = `Progreso diario: ${percent}% (${completed}/${total})`;
}

function renderHabits() {
  const habitList = document.getElementById("habit-list");
  habitList.innerHTML = "";

  habits.forEach((habit, index) => {
    const habitDiv = document.createElement("div");
    habitDiv.className = "habit";

    const label = document.createElement("label");
    label.textContent = habit.name;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.completed;
    checkbox.addEventListener("change", () => {
      habits[index].completed = checkbox.checked;
      saveHabits();
      updateStats();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", () => {
      habits.splice(index, 1);
      saveHabits();
      renderHabits();
    });

    habitDiv.appendChild(label);
    habitDiv.appendChild(checkbox);
    habitDiv.appendChild(deleteBtn);
    habitList.appendChild(habitDiv);
  });

  updateStats();
}

function addHabit() {
  const input = document.getElementById("new-habit");
  const name = input.value.trim();
  if (name !== "") {
    habits.push({ name, completed: false });
    input.value = "";
    saveHabits();
    renderHabits();
  }
}

function resetHabits() {
  habits.forEach((h) => (h.completed = false));
  saveHabits();
  renderHabits();
}

document.addEventListener("DOMContentLoaded", () => {
  loadHabits();
  renderHabits();

  document.getElementById("add-habit").addEventListener("click", addHabit);
  document.getElementById("reset").addEventListener("click", resetHabits);
});
