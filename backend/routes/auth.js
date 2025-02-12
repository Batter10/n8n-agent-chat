const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

// Registratie
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check of gebruiker al bestaat
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        error: 'Een gebruiker met deze email of gebruikersnaam bestaat al'
      });
    }

    // Hash wachtwoord
    const hashedPassword = await bcrypt.hash(password, 10);

    // Maak nieuwe gebruiker
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    // Maak standaard gebruikersinstellingen
    await pool.query(
      'INSERT INTO user_settings (user_id) VALUES ($1)',
      [result.rows[0].id]
    );

    res.status(201).json({
      message: 'Account succesvol aangemaakt',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Registratie error:', err);
    res.status(500).json({ error: 'Er ging iets mis bij het registreren' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Zoek gebruiker
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    // Controleer wachtwoord
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    // Update laatste login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Genereer JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Er ging iets mis bij het inloggen' });
  }
});

// Gebruiker profiel ophalen
router.get('/profile', async (req, res) => {
  try {
    // Token verificatie middleware zorgt dat we req.user hebben
    const result = await pool.query(
      'SELECT id, username, email, created_at, last_login FROM users WHERE id = $1',
      [req.user.userId]
    );

    // Haal gebruikersinstellingen op
    const settingsResult = await pool.query(
      'SELECT theme, language, notifications_enabled FROM user_settings WHERE user_id = $1',
      [req.user.userId]
    );

    res.json({
      user: result.rows[0],
      settings: settingsResult.rows[0]
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Er ging iets mis bij het ophalen van het profiel' });
  }
});

// Gebruikersinstellingen updaten
router.put('/settings', async (req, res) => {
  try {
    const { theme, language, notifications_enabled } = req.body;

    await pool.query(
      `UPDATE user_settings 
       SET theme = $1, language = $2, notifications_enabled = $3
       WHERE user_id = $4`,
      [theme, language, notifications_enabled, req.user.userId]
    );

    res.json({ message: 'Instellingen succesvol bijgewerkt' });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ error: 'Er ging iets mis bij het updaten van de instellingen' });
  }
});

module.exports = router;