// Task data - using an array of objects to store tasks
let tasks = [];
let currentFilter = 'all';

// DOM elements - grabbing them once to avoid repeated queries
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const tasksCounter = document.getElementById('tasks-counter');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');

// Initialize app
function init() {
    // Load tasks from localStorage if available
    loadTasks();
    renderTasks();
    setupEventListeners();
}

// Set up all event listeners in one place for clarity
function setupEventListeners() {
    // Fix: Properly call the addTask function
    addBtn.addEventListener('click', function() {
        addTask();
    });
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Fix: Use proper event delegation for task list
    taskList.addEventListener('click', function(e) {
        handleTaskClick(e);
    });
    
    // Event listeners for filter buttons using proper event delegation
    document.querySelector('.filter-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            setFilter(e.target.getAttribute('data-filter'));
        }
    });

    // Fix: Properly call the clearCompleted function
    clearCompletedBtn.addEventListener('click', function() {
        clearCompleted();
    });
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        // Add visual feedback for empty input
        taskInput.classList.add('error');
        setTimeout(() => {
            taskInput.classList.remove('error');
        }, 500);
        return; // Don't add empty tasks
    }
    
    // Create a new task object
    const newTask = {
        id: generateId(), // Helper to create unique IDs
        text: taskText,
        completed: false,
        createdAt: new Date().getTime()
    };
    
    // Add to tasks array
    tasks.push(newTask);
    
    // Clear input and update UI
    taskInput.value = '';
    saveTasks();
    renderTasks();
    
    // Set focus back to input for better UX
    taskInput.focus();
}

// Helper to generate unique IDs - simple but effective
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Toggle task completion status
function toggleTaskStatus(id) {
    // Fix: Properly find and toggle the task
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }
        return task;
    });
    
    saveTasks();
    renderTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Handle clicks on task items (checkbox and delete)
function handleTaskClick(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = taskItem.getAttribute('data-id');
    
    if (e.target.classList.contains('task-checkbox')) {
        toggleTaskStatus(taskId);
    } else if (e.target.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }
}

// Set current filter and update UI
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTasks();
}

// Clear all completed tasks
function clearCompleted() {
    const hasCompleted = tasks.some(task => task.completed);
    
    if (hasCompleted) {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }
}

// Render tasks based on current filter
function renderTasks() {
    // Filter tasks according to current selection
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all' filter
    });
    
    // Clear task list
    taskList.innerHTML = '';
    
    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No ${currentFilter} tasks to show</p>
                ${currentFilter === 'all' ? '<p>Add a task to get started!</p>' : ''}
            </div>
        `;
    } else {
        // Create HTML for each task
        filteredTasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.classList.add('task-item');
            if (task.completed) {
                taskElement.classList.add('completed');
            }
            taskElement.setAttribute('data-id', task.id);
            
            taskElement.innerHTML = `
                <div class="checkbox-wrapper">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${escapeHTML(task.text)}</span>
                </div>
                <button class="delete-btn">×</button>
            `;
            
            taskList.appendChild(taskElement);
        });
    }
    
    // Update task counter
    const activeTasks = tasks.filter(task => !task.completed).length;
    tasksCounter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    
    // Show/hide clear completed button based on if there are completed tasks
    const hasCompleted = tasks.some(task => task.completed);
    clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';
}

// Helper function to escape HTML to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Save tasks to localStorage
function saveTasks() {
    try {
        localStorage.setItem('myTodoList', JSON.stringify(tasks));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

// Load tasks from localStorage
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('myTodoList');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        tasks = [];
    }
}

// Start the app!
document.addEventListener('DOMContentLoaded', function() {
    init();
});
