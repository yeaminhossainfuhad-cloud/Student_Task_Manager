// State Application Management
let tasks = [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskSubjectInput = document.getElementById('task-subject');
const taskPrioritySelect = document.getElementById('task-priority');
const taskListContainer = document.getElementById('task-list');

const totalCountEl = document.getElementById('total-count');
const completedCountEl = document.getElementById('completed-count');
const pendingCountEl = document.getElementById('pending-count');

const filterButtons = document.querySelectorAll('.btn-filter');
const themeToggleBtn = document.getElementById('theme-toggle');

// 1. Live Date & Time Counter (setInterval)
function updateDateTime() {
    const now = new Date();
    
    // Formatting date: e.g., "25 June 2026"
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-GB', options);
    
    // Formatting time: e.g., "10:30:15 AM"
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}
setInterval(updateDateTime, 1000);
updateDateTime(); // Immediate call to avoid 1s initial lag

// 2. Add New Task Functionality
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTask = {
        id: Date.now(), // unique identifier for manipulating data item
        title: taskNameInput.value.trim(),
        subject: taskSubjectInput.value.trim(),
        priority: taskPrioritySelect.value,
        completed: false
    };

    tasks.push(newTask);
    taskForm.reset();
    render();
});

// 3. Complete and Delete Operations
function toggleTaskComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    render();
}

// 4. Filter Configuration Listener
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        render();
    });
});

// 5. Update UI Metrics and Counters
function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalCountEl.textContent = total;
    completedCountEl.textContent = completed;
    pendingCountEl.textContent = pending;
}

// 6. Main Engine Renderer
function render() {
    taskListContainer.innerHTML = '';

    // Filter validation logic pipeline
    let filteredTasks = tasks;
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    }

    // Direct Element Generation Mapping loop
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority.toLowerCase()} ${task.completed ? 'is-completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-details">
                <h3 class="task-title">${task.title}</h3>
                <div class="task-meta">
                    <span>📚 Subject: ${task.subject}</span> | 
                    <span>⚠️ Priority: ${task.priority}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-complete" onclick="toggleTaskComplete(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskListContainer.appendChild(li);
    });

    updateCounters();
}

// 7. Bonus Feature: Theme Styling Toggler
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        themeToggleBtn.textContent = 'Dark Mode';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = 'Light Mode';
    }
});