const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const TODOLIST_FILE = path.join(__dirname, 'todolist.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// GET - Read all todos
app.get('/api/todos', async (req, res) => {
  try {
    const data = await fs.readFile(TODOLIST_FILE, 'utf8');
    const todos = JSON.parse(data);
    res.json(todos);
  } catch (error) {
    console.error('Error reading todos:', error);
    res.status(500).json({ error: 'Failed to read todos' });
  }
});

// POST - Save all todos
app.post('/api/todos', async (req, res) => {
  try {
    const todos = req.body;
    await fs.writeFile(TODOLIST_FILE, JSON.stringify(todos, null, 2));
    res.json({ success: true, message: 'Todos saved successfully' });
  } catch (error) {
    console.error('Error saving todos:', error);
    res.status(500).json({ error: 'Failed to save todos' });
  }
});

// DELETE - Delete a specific todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const data = await fs.readFile(TODOLIST_FILE, 'utf8');
    let todos = JSON.parse(data);
    
    todos = todos.filter(todo => todo.id !== todoId);
    
    await fs.writeFile(TODOLIST_FILE, JSON.stringify(todos, null, 2));
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
