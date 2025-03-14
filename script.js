document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    let draggedItem = null;

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '<li class="task-header"><span>List</span><span class="task-status">Status</span></li>';
        tasks.forEach(task => addTaskToDOM(task.text, task.completed));

    };

    const addTaskToDOM = (text, completed = false) => {
        const li = document.createElement('li');
        li.draggable = true;
        li.classList.add('task-item');

        let taskContainer = document.createElement('div');
        taskContainer.classList.add('task-content');
        taskContainer.textContent = text;
        
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        if (completed) {
            li.style.backgroundColor = "#90F68E";
        }
        checkbox.classList.add('task-checkbox');
        checkbox.addEventListener('change', () => {
            li.style.backgroundColor = checkbox.checked ? "#90F68E" : "";
            saveTasks();
        });

        const editBtn = document.createElement('img');
        editBtn.src = "edit.png";
        editBtn.alt = "Edit";
        editBtn.classList.add('edit-icon');
        editBtn.addEventListener('click', () => enableEditing(taskContainer, editBtn));

        const deleteIcon = document.createElement('img');
        deleteIcon.src = "delete.png"; // Local delete icon
        deleteIcon.alt = "Delete";
        deleteIcon.classList.add('delete-icon');
        deleteIcon.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        li.addEventListener('dragstart', () => {
            draggedItem = li;
            li.classList.add('dragging');
        });

        li.addEventListener('dragend', () => {
            draggedItem = null;
            li.classList.remove('dragging');
            saveTasks();
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingOverItem = e.target.closest('.task-item');
            if (draggingOverItem && draggingOverItem !== draggedItem) {
                const bounding = draggingOverItem.getBoundingClientRect();
                const offset = e.clientY - bounding.top;
                if (offset > bounding.height / 2) {
                    draggingOverItem.after(draggedItem);
                } else {
                    draggingOverItem.before(draggedItem);
                }
            }
        });

        li.appendChild(taskContainer);
        li.appendChild(checkbox);
        li.appendChild(editBtn);
        li.appendChild(deleteIcon);
        taskList.appendChild(li);
        saveTasks();
    };

    const enableEditing = (taskContainer, editBtn) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = taskContainer.textContent;
        input.classList.add('edit-input');
        taskContainer.replaceWith(input);
        input.focus();

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit(input, editBtn);
            }
        });

        input.addEventListener('blur', () => saveEdit(input, editBtn));
    };

    const saveEdit = (input, editBtn) => {
        const newTaskContainer = document.createElement('div');
        newTaskContainer.classList.add('task-content');
        newTaskContainer.textContent = input.value.trim() || "Unnamed Task";
        newTaskContainer.setAttribute("data-full-text", newTaskContainer.textContent); // Update tooltip
        input.replaceWith(newTaskContainer);
        editBtn.addEventListener('click', () => enableEditing(newTaskContainer, editBtn));
        saveTasks();
    };

    const saveTasks = () => {
        const tasks = [...document.querySelectorAll('.task-item')].map(li => ({
            text: li.querySelector('.task-content').textContent,
            completed: li.querySelector('.task-checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (taskInput.value.trim()) {
            addTaskToDOM(taskInput.value);
            taskInput.value = '';
        }
    });

    loadTasks();
});
