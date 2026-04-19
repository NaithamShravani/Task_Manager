let tasks = [];

function addTask() {
  const title = document.getElementById("taskTitle").value;
  const category = document.getElementById("taskCategory").value;
  const priority = document.getElementById("taskPriority").value;
  const due = document.getElementById("taskDue").value;
  const tags = document.getElementById("taskTags").value;

  if (!title || !due) return alert("Please enter task title and due date!");

  const task = {
    id: Date.now(),
    title,
    category,
    priority,
    due: new Date(due),
    tags: tags.split(",").map(t => t.trim()),
    completed: false
  };

  tasks.push(task);
  renderTasks();
}

function renderTasks(filtered = tasks) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = "<p>No tasks found. Try adjusting your filters or add a new task above.</p>";
    return;
  }

  // Sort by deadline by default
  filtered.sort((a, b) => a.due - b.due);

  filtered.forEach(task => {
    const li = document.createElement("li");

    if (!task.completed && task.due < new Date()) {
      li.classList.add("overdue");
    }

    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">
        [${task.category}] ${task.title} - ${task.priority} 
        (Due: ${task.due.toLocaleString()}) 
        Tags: ${task.tags.join(", ")}
      </span>
      <div>
        <button onclick="toggleComplete(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function searchTasks() {
  const keyword = document.getElementById("searchBox").value.toLowerCase();
  const filtered = tasks.filter(t => 
    t.title.toLowerCase().includes(keyword) ||
    t.tags.some(tag => tag.toLowerCase().includes(keyword))
  );
  renderTasks(filtered);
}

function filterTasks() {
  const status = document.getElementById("filterStatus").value;
  const category = document.getElementById("filterCategory").value;
  const sort = document.getElementById("filterSort").value;

  let filtered = tasks;

  if (status !== "All") {
    filtered = filtered.filter(t => status === "Completed" ? t.completed : !t.completed);
  }
  if (category !== "All") {
    filtered = filtered.filter(t => t.category === category);
  }

  if (sort === "Priority") {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else {
    filtered.sort((a, b) => a.due - b.due);
  }

  renderTasks(filtered);
}
