// ===== Variable Declaration =====
const myModelElement = document.getElementById("MyModal");
const myModal = new bootstrap.Modal(myModelElement);

// Input & Buttons
const taskInput = document.querySelector('input[type="text"]');
const addBtn = document.querySelector(".btn.btn-primary");
const clearBtn = document.querySelector(".btn.btn-danger");

// ===== Get data from localStorage =====
function getTasks() {
    let tasks = [];
    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    return tasks;
}

// ===== Save data to localStorage =====
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== Render tasks in table =====
function renderTask() {
    const tasks = getTasks();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const row = `
        <tr>
            <td>${index + 1}</td>
            <td>${task.taskName}</td>
            <td>
                <span class="badge ${task.status === "Completed" ? "bg-success" : "bg-warning"}"
                      style="cursor:pointer"
                      onclick="toggleStatus(${task.id})">
                    ${task.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-success" onclick="editTask(${task.id})">
                    <i class="bi bi-pencil-square"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
        `;
        taskList.innerHTML += row;
    });
}

// ===== Add Task =====
function addTask() {
    const taskName = taskInput.value.trim();
    if (taskName === "") {
        alert("Please enter a task name.");
        return;
    }
    const tasks = getTasks();
    const newTask = {
        id: Date.now(), // unique ID
        taskName: taskName,
        status: "Pending"
    };
    tasks.push(newTask);
    saveTasks(tasks);
    renderTask();
    taskInput.value = "";
}

// ===== Delete Task =====
function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        const tasks = getTasks();
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        saveTasks(updatedTasks);
        renderTask();
    }
}

// ===== Edit Task =====
function editTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const newName = prompt("Edit task name:", task.taskName);
        if (newName !== null && newName.trim() !== "") {
            task.taskName = newName.trim();
            saveTasks(tasks);
            renderTask();
        }
    }
}

// ===== Toggle Status =====
function toggleStatus(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = (task.status === "Pending") ? "Completed" : "Pending";
        saveTasks(tasks);
        renderTask();
    }
}

// ===== Clear All Tasks =====
function clearAllTasks() {
    if (confirm("Are you sure you want to clear all tasks?")) {
        localStorage.removeItem("tasks");
        renderTask();
    }
}

// ===== Event Listeners =====
addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearAllTasks);

// ===== Initial Load =====
renderTask();