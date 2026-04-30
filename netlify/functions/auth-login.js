// netlify/functions/auth-login.js
// POST /api/auth-login
// Body: { email, password }
// Returns: { token } on success

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./_db');
const { ok, error, handleOptions, CORS_HEADERS } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return error('Method not allowed', 405);

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return error('Email and password are required', 400);
    }

    // Look up the admin user in database
    const { rows } = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      // Use same message as wrong password - don't reveal which one was wrong
      return error('Invalid email or password', 401);
    }

    const admin = rows[0];

    // Compare submitted password against stored bcrypt hash
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return error('Invalid email or password', 401);
    }

    // Update last login time
    await pool.query(
      'UPDATE admin_users SET last_login = now() WHERE id = $1',
      [admin.id]
    );

    // Create JWT token - expires in 7 days
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return ok({ token, email: admin.email });

  } catch (err) {
    console.error('Login error:', err);
    return error('Login failed');
  }
};
