document.addEventListener('DOMContentLoaded', function() {
  const todoList = document.getElementById('todoList');
  let todos = []; // store all the todos
  const API_URL = 'http://localhost:3000/api/todos';

  // Load todos from backend
  async function loadTodos() {
    try {
      const response = await fetch(API_URL);
      todos = await response.json();
      renderTodos(todos);
    } catch (error) {
      console.error('Error loading todos:', error);
      todos = [];
    }
  }

  // Save todos to backend
  async function saveTodos() {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todos)
      });
      const result = await response.json();
      console.log('Todos saved:', result.message);
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }

  function renderTodos(todos) {
    todoList.innerHTML = '';
    if (todos.length === 0) {
      todoList.innerHTML = '<li class="list-group-item text-center text-muted">No tasks yet. Add your first task!</li>';
      return;
    }
    for (let todo of todos) {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center mb-2 border-start border-4 border-primary';
      li.setAttribute('data-id', todo.id);
      
      const urgencyColor = todo.urgency >= 4 ? 'danger' : todo.urgency >= 3 ? 'warning' : 'success';
      const urgencyStars = '⭐'.repeat(todo.urgency);
      
      li.innerHTML = `
        <div class="d-flex align-items-center flex-grow-1">
          <span class="task-name fs-5" data-id="${todo.id}">${todo.name}</span>
          <input type="text" class="form-control task-name-input d-none" data-id="${todo.id}" value="${todo.name}">
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-${urgencyColor} fs-6 urgency-badge" data-id="${todo.id}" title="Urgency Level">${urgencyStars}</span>
          <select class="form-select form-select-sm urgency-select d-none" data-id="${todo.id}" style="width: 80px;">
            <option value="1" ${todo.urgency === 1 ? 'selected' : ''}>1</option>
            <option value="2" ${todo.urgency === 2 ? 'selected' : ''}>2</option>
            <option value="3" ${todo.urgency === 3 ? 'selected' : ''}>3</option>
            <option value="4" ${todo.urgency === 4 ? 'selected' : ''}>4</option>
            <option value="5" ${todo.urgency === 5 ? 'selected' : ''}>5</option>
          </select>
          <button class="btn btn-outline-primary btn-sm edit-btn" data-id="${todo.id}">
            ✏️ Edit
          </button>
          <button class="btn btn-outline-success btn-sm save-btn d-none" data-id="${todo.id}">
            💾 Save
          </button>
          <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${todo.id}">
            🗑️ Delete
          </button>
        </div>
      `;
      todoList.appendChild(li);
    }
  }

  // Edit, Save, and Delete todo functionality
  document.addEventListener('click', function(e) {
    const todoId = parseInt(e.target.getAttribute('data-id'));
    
    // Delete functionality
    if (e.target.classList.contains('delete-btn')) {
      deleteTask(todos, todoId);
      renderTodos(todos);
      saveTodos();
    }
    
    // Edit functionality
    if (e.target.classList.contains('edit-btn')) {
      const li = e.target.closest('li');
      const taskNameSpan = li.querySelector('.task-name');
      const taskNameInput = li.querySelector('.task-name-input');
      const urgencyBadge = li.querySelector('.urgency-badge');
      const urgencySelect = li.querySelector('.urgency-select');
      const editBtn = li.querySelector('.edit-btn');
      const saveBtn = li.querySelector('.save-btn');
      
      // Toggle edit mode
      taskNameSpan.classList.add('d-none');
      taskNameInput.classList.remove('d-none');
      urgencyBadge.classList.add('d-none');
      urgencySelect.classList.remove('d-none');
      editBtn.classList.add('d-none');
      saveBtn.classList.remove('d-none');
      
      taskNameInput.focus();
    }
    
    // Save functionality
    if (e.target.classList.contains('save-btn')) {
      const li = e.target.closest('li');
      const taskNameInput = li.querySelector('.task-name-input');
      const urgencySelect = li.querySelector('.urgency-select');
      const newTaskName = taskNameInput.value.trim();
      const newUrgency = parseInt(urgencySelect.value);
      
      if (newTaskName) {
        modifyTask(todos, todoId, newTaskName, newUrgency);
        renderTodos(todos);
        saveTodos();
      } else {
        alert('Task name cannot be empty!');
      }
    }
  });

  async function main() {
    // Load todos from backend
    await loadTodos();

    const addTodoButton = document.querySelector("#addTodo");
    addTodoButton.addEventListener('click', function() {
      const taskNameInput = document.querySelector("#taskName");
      const taskName = taskNameInput.value;

      const taskUrgencySelect = document.querySelector("#taskUrgency");
      const taskUrgency = parseInt(taskUrgencySelect.value);

      if (taskName) {
        addTodo(todos, taskName, taskUrgency);
        renderTodos(todos);
        saveTodos();
        taskNameInput.value = '';
      }
    });
  }

  main();
});