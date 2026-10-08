require('dotenv').config();


const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());



const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }

  console.log('Connected to MariaDB!');
});

app.get('/', (req, res) => {
  res.send('Task Manager API is running!');
});

app.get('/api/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({
        error: 'Failed to fetch tasks'
      });
    }

    res.json(results);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, status, priority, dueDate, category } = req.body;

  const sql = `
    INSERT INTO tasks (title, description, status, priority, dueDate, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, status, priority, dueDate || null, category],
    (err, result) => {
      if (err) {
        console.error('Error adding task:', err);
        return res.status(500).json({ error: 'Failed to add task' });
      }

      res.status(201).json({
        id: result.insertId,
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null,
        category
      });
    }
  );
});

app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status, priority, dueDate, category } = req.body;

  const sql = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?, priority = ?,
        dueDate = ?, category = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [title, description, status, priority, dueDate || null, category, req.params.id],
    (err, result) => {
      if (err) {
        console.error('Error updating task:', err);
        return res.status(500).json({ error: 'Failed to update task' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ id: Number(req.params.id), ...req.body });
    }
  );
});

app.delete('/api/tasks/:id', (req, res) => {
  db.query(
    'DELETE FROM tasks WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error('Error deleting task:', err);
        return res.status(500).json({ error: 'Failed to delete task' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    }
  );
});
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});