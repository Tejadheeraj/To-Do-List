document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
  
    // Load tasks from LocalStorage
    const loadTasks = () => {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => addTaskToDOM(task));
    };
  
    // Add task to the DOM
    const addTaskToDOM = (task) => {
      const li = document.createElement('li');
      li.textContent = task;
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete');
      deleteBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
      });
  
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    };
  
    // Save tasks to LocalStorage
    const saveTasks = () => {
      const tasks = Array.from(taskList.children).map(li => li.firstChild.textContent);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };
  
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (taskInput.value.trim()) {
        addTaskToDOM(taskInput.value);
        saveTasks();
        taskInput.value = '';
      }
    });
  
    // Initial load
    loadTasks();
  });
  