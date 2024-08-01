// Selecting elements from the DOM
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const dueDateInput = document.getElementById('dueDateInput');
const categorySelect = document.getElementById('categorySelect');
const filterSelect = document.getElementById('filterSelect');
const taskList = document.getElementById('taskList');

// Function to create a new task item
function createTaskItem(taskContent, priority, dueDate, category) {
    const li = document.createElement('li');
    li.classList.add(`priority-${priority}`);
    li.setAttribute('data-category', category);
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const span = document.createElement('span');
    span.textContent = taskContent;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');

    li.appendChild(checkbox);
    li.appendChild(span);
    if (dueDate) {
        const dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = `Due Date: ${dueDate}`;
        li.appendChild(dueDateSpan);
    }
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    // Event listener for delete button
    deleteButton.addEventListener('click', function() {
        li.remove();
        updateLocalStorage();
    });

    // Event listener for checkbox
    checkbox.addEventListener('change', function() {
        span.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
        updateLocalStorage();
    });
}

// Function to handle form submission
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskContent = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;
    const category = categorySelect.value;
    
    if (taskContent !== '') {
        createTaskItem(taskContent, priority, dueDate, category);
        taskInput.value = '';
        dueDateInput.value = '';
        updateLocalStorage();
    } else {
        alert('Please enter a task!');
    }
});

// Function to update local storage
function updateLocalStorage() {
    const tasks = [];
    const taskItems = taskList.getElementsByTagName('li');
    for (let i = 0; i < taskItems.length; i++) {
        const taskContent = taskItems[i].getElementsByTagName('span')[0].textContent;
        const priorityClass = Array.from(taskItems[i].classList).find(cls => cls.startsWith('priority-'));
        const priority = priorityClass ? priorityClass.split('-')[1] : 'low';
        let dueDate = '';
        const dueDateSpan = taskItems[i].querySelector('span:nth-child(3)');
        if (dueDateSpan) {
            dueDate = dueDateSpan.textContent.split(':')[1].trim();
        }
        const taskCompleted = taskItems[i].getElementsByTagName('input')[0].checked;
        const category = taskItems[i].getAttribute('data-category');
        tasks.push({ content: taskContent, priority: priority, dueDate: dueDate, completed: taskCompleted, category: category });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(function(task) {
        createTaskItem(task.content, task.priority, task.dueDate, task.category);
        const li = taskList.lastElementChild;
        const checkbox = li.getElementsByTagName('input')[0];
        checkbox.checked = task.completed;
        const span = li.getElementsByTagName('span')[0];
        if (task.completed) {
            span.style.textDecoration = 'line-through';
        }
    });
}

// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTasksFromLocalStorage();
});

// Function to filter tasks based on category
filterSelect.addEventListener('change', function() {
    const selectedCategory = filterSelect.value;
    const taskItems = taskList.getElementsByTagName('li');
    for (let i = 0; i < taskItems.length; i++) {
        const category = taskItems[i].getAttribute('data-category');
        if (selectedCategory === 'all' || category === selectedCategory) {
            taskItems[i].style.display = 'flex';
        } else {
            taskItems[i].style.display = 'none';
        }
    }
});

// Make the task list sortable
new Sortable(taskList, {
    animation: 150,
    onEnd: updateLocalStorage
});
