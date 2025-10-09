const express = require('express');
const router = express.Router();
const db = require('../db');

// Create new user
router.post('/', async (req, res) => {
  const { name, gender, birthdate } = req.body;
  try {
    await db.query(
      'INSERT INTO users (name, gender, birthdate) VALUES ($1, $2, $3)',
      [name, gender, birthdate]
    );
    res.status(201).json({ message: 'User added successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { name, gender, birthdate } = req.body;
  const { id } = req.params;
  try {
    await db.query(
      'UPDATE users SET name = $1, gender = $2, birthdate = $3 WHERE id = $4',
      [name, gender, birthdate, id]
    );
    res.json({ message: 'User updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
