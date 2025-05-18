document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const clearAllButton = document.getElementById('clear-all');
    
    // Load tasks from localStorage
    loadTasks();
    
    // Add task when button is clicked
    addButton.addEventListener('click', addTask);
    
    // Add task when Enter key is pressed
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Clear all tasks
    clearAllButton.addEventListener('click', clearAllTasks);
    
    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            return; // Don't add empty tasks
        }
        
        // Create new task object
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        // Add task to DOM
        createTaskElement(task);
        
        // Add task to localStorage
        saveTask(task);
        
        // Clear input field
        taskInput.value = '';
        taskInput.focus();
    }
    
    // Function to create task DOM element
    function createTaskElement(task) {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        todoItem.dataset.id = task.id;
        
        if (task.completed) {
            todoItem.classList.add('completed');
        }
        
        todoItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">🗑</button>
        `;
        
        // Add event listener for checkbox
        const checkbox = todoItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            toggleTaskStatus(task.id, checkbox.checked);
            todoItem.classList.toggle('completed');
        });
        
        // Add event listener for delete button
        const deleteBtn = todoItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
            todoItem.remove();
        });
        
        // Add task to the list
        todoList.appendChild(todoItem);
    }
    
    // Function to save task to localStorage
    function saveTask(task) {
        let tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Function to get tasks from localStorage
    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }
    
    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => {
            createTaskElement(task);
        });
    }
    
    // Function to toggle task status
    function toggleTaskStatus(id, completed) {
        let tasks = getTasks();
        const taskIndex = tasks.findIndex(task => task.id === id);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
    
    // Function to delete a task
    function deleteTask(id) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Function to clear all tasks
    function clearAllTasks() {
        localStorage.removeItem('tasks');
        todoList.innerHTML = '';
    }
});