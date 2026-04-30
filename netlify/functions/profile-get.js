// netlify/functions/profile-get.js
// GET /api/profile-get
// Public - no auth needed
// Returns the single profile row

const pool = require('./_db');
const { ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  try {
    const { rows } = await pool.query('SELECT * FROM profile LIMIT 1');

    if (rows.length === 0) {
      return error('Profile not found', 404);
    }

    return ok(rows[0]);
  } catch (err) {
    console.error('profile-get error:', err);
    return error('Failed to fetch profile');
  }
};
