const express = require('express');
const router = express.Router();
const db = require('../db/db');

// ✅ Add employee
router.post('/', async (req, res) => {
  const { name, title } = req.body;

  if (!name || !title) {
    return res.status(400).json({ error: 'Missing name or title' });
  }

  try {
    const result = await db.query(
      'INSERT INTO employees (name, title) VALUES ($1, $2) RETURNING *',
      [name, title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

// ===========================
// 🗑️ Delete Employee
// ===========================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  try {
    const result = await db.query('DELETE FROM employees WHERE idemployee = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully', employee: result.rows[0] });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// ===========================
// Fetch All Employees
// ===========================
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM employees ORDER BY title, idemployee;');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// ===========================
// Check if Is Manager
// ===========================
router.get('/isManager', async (req, res) => {
  const { name } = req.query; // Extract the name from the query parameters

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM employees WHERE name = $1 AND title = $2',
      [name, 'Manager']
    );

    if (result.rows.length > 0) {
      res.status(200).json({ isManager: true });
    } else {
      res.status(200).json({ isManager: false });
    }
  } catch (err) {
    console.error('Error checking manager status:', err);
    res.status(500).json({ error: 'Failed to check manager status' });
  }
});

// ===========================
// Check if Is Employee
// ===========================
router.get('/isEmployee', async (req, res) => {
  const { name } = req.query; // Extract the name from the query parameters

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM employees WHERE name = $1',
      [name]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ isEmployee: true });
    } else {
      res.status(200).json({ isEmployee: false });
    }
  } catch (err) {
    console.error('Error checking employee status:', err);
    res.status(500).json({ error: 'Failed to check employee status' });
  }
});

module.exports = router;