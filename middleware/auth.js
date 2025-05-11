const basicAuth = require('basic-auth');
const db = require('../models/db');
require('dotenv').config();

const authenticateAdmin = async (req, res, next) => {
  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM admin WHERE username = ? AND password = ?', [
      user.name,
      user.pass
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Credentials are valid
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authenticateAdmin;
