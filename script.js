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
      
      const urgencyColor = todo.urgency >= 4 ? 'danger' : todo.urgency >= 3 ? 'warning' : 'success';
      const urgencyStars = '⭐'.repeat(todo.urgency);
      
      li.innerHTML = `
        <div class="d-flex align-items-center flex-grow-1">
          <span class="fs-5">${todo.name}</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-${urgencyColor} fs-6" title="Urgency Level">${urgencyStars}</span>
          <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${todo.id}">
            🗑️ Delete
          </button>
        </div>
      `;
      todoList.appendChild(li);
    }
  }

  // Delete todo functionality
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
      const todoId = parseInt(e.target.getAttribute('data-id'));
      deleteTask(todos, todoId);
      renderTodos(todos);
      saveTodos();
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