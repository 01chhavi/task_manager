const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date");
const categorySelect = document.getElementById("category");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const themeSwitch = document.getElementById("theme-switch");
const filters = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "All";

// Load theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeSwitch.checked = true;
}

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  const today = new Date().toISOString().split("T")[0];

  tasks.forEach((task, index) => {
    if (
      currentFilter !== "All" &&
      !(currentFilter === "Today" && task.due === today) &&
      task.category !== currentFilter
    ) return;

    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const dueText = task.due ? ` - Due: ${task.due}` : "";

    li.innerHTML = `
      <span onclick="toggleTask(${index})">${task.text} (${task.category})${dueText}</span>
      <button onclick="deleteTask(${index})">❌</button>
    `;
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const due = dueDateInput.value;
  const category = categorySelect.value;

  if (text) {
    tasks.push({ text, due, category, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
    dueDateInput.value = "";
    categorySelect.value = "General";
  }
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

renderTasks();
