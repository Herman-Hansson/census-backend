const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/auth');
const validator = require('validator');
const db = require('../models/db');

// Test route
router.get('/test', authenticateAdmin, (req, res) => {
  res.json({ message: 'You are authenticated as admin' });
});

// Add participant
router.post('/add', authenticateAdmin, async (req, res) => {
  const { email, firstname, lastname, dob, work, home } = req.body;

  if (!email || !firstname || !lastname || !dob || !work || !home) {
    return res.status(400).json({ error: 'Missing required participant data' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dobRegex.test(dob)) {
    return res.status(400).json({ error: 'DOB must be in YYYY-MM-DD format' });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    await conn.execute(
      'INSERT INTO participants (email, firstname, lastname, dob) VALUES (?, ?, ?, ?)',
      [email, firstname, lastname, dob]
    );

    await conn.execute(
      'INSERT INTO work (email, companyname, salary, currency) VALUES (?, ?, ?, ?)',
      [email, work.companyname, work.salary, work.currency]
    );

    await conn.execute(
      'INSERT INTO home (email, country, city) VALUES (?, ?, ?)',
      [email, home.country, home.city]
    );

    await conn.commit();
    res.status(201).json({ message: 'Participant added successfully' });

  } catch (error) {
    await conn.rollback();
    console.error('Error inserting participant:', error);
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
});

// Get all participants
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM participants');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to retrieve participants' });
  }
});

// Get name + email only
router.get('/details', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT firstname, lastname, email FROM participants');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching participant details:', error);
    res.status(500).json({ error: 'Failed to retrieve participant details' });
  }
});

// GET /participants/details/:email - return personal info for one participant
router.get('/details/:email', authenticateAdmin, async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT firstname, lastname, dob FROM participants WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching participant by email:', error);
    res.status(500).json({ error: 'Failed to retrieve participant data' });
  }
});

// GET /participants/work/:email - return work info for one participant
router.get('/work/:email', authenticateAdmin, async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT companyname, salary, currency FROM work WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Work info not found for this participant' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching work info:', error);
    res.status(500).json({ error: 'Failed to retrieve work info' });
  }
});

// GET /participants/home/:email - return home info for one participant
router.get('/home/:email', authenticateAdmin, async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT country, city FROM home WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Home info not found for this participant' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching home info:', error);
    res.status(500).json({ error: 'Failed to retrieve home info' });
  }
});

// DELETE /participants/:email - delete a participant and related data
router.delete('/:email', authenticateAdmin, async (req, res) => {
  const { email } = req.params;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Delete from home, work, then participants
    await conn.execute('DELETE FROM home WHERE email = ?', [email]);
    await conn.execute('DELETE FROM work WHERE email = ?', [email]);
    const [result] = await conn.execute('DELETE FROM participants WHERE email = ?', [email]);

    await conn.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    res.json({ message: 'Participant deleted successfully' });

  } catch (error) {
    await conn.rollback();
    console.error('Error deleting participant:', error);
    res.status(500).json({ error: 'Failed to delete participant' });
  } finally {
    conn.release();
  }
});

// PUT /participants/:email - update full participant info
router.put('/:email', authenticateAdmin, async (req, res) => {
  const { email } = req.params;
  const { firstname, lastname, dob, work, home } = req.body;

  // Validate input
  if (!firstname || !lastname || !dob || !work || !home) {
    return res.status(400).json({ error: 'Missing required data for update' });
  }

  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dobRegex.test(dob)) {
    return res.status(400).json({ error: 'DOB must be in YYYY-MM-DD format' });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Update participants table
    const [result] = await conn.execute(
      'UPDATE participants SET firstname = ?, lastname = ?, dob = ? WHERE email = ?',
      [firstname, lastname, dob, email]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Participant not found' });
    }

    // Update work table
    await conn.execute(
      'UPDATE work SET companyname = ?, salary = ?, currency = ? WHERE email = ?',
      [work.companyname, work.salary, work.currency, email]
    );

    // Update home table
    await conn.execute(
      'UPDATE home SET country = ?, city = ? WHERE email = ?',
      [home.country, home.city, email]
    );

    await conn.commit();
    res.json({ message: 'Participant updated successfully' });

  } catch (error) {
    await conn.rollback();
    console.error('Error updating participant:', error);
    res.status(500).json({ error: 'Failed to update participant' });
  } finally {
    conn.release();
  }
});


module.exports = router;
