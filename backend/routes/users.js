const express = require('express');
const router = express.Router();
const db = require('../db');
const { Parser } = require('json2csv');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

// AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

// ✅ Export all users to CSV and upload to S3
router.get('/export-csv', async (req, res) => {
  try {
    // 1️⃣ Fetch data
    const result = await db.query('SELECT * FROM users ORDER BY id ASC');
    const users = result.rows;

    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found to export' });
    }

    // 2️⃣ Convert to CSV
    const parser = new Parser();
    const csv = parser.parse(users);

    // 3️⃣ Prepare S3 upload
    const filename = `users_export_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.csv`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: csv,
      ContentType: 'text/csv',
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // 4️⃣ Construct S3 URL (assuming bucket is public or has appropriate policy)
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    res.json({ message: 'CSV exported and uploaded successfully!', fileUrl });
  } catch (err) {
    console.error('CSV export failed:', err);
    res.status(500).json({ error: 'CSV export failed' });
  }
});

module.exports = router;
