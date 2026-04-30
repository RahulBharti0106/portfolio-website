// netlify/functions/admin-skills-list.js
// GET /api/admin-skills-list
// Protected - returns ALL skills including hidden ones

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM skills ORDER BY display_order ASC'
    );
    return ok(rows);
  } catch (err) {
    console.error('admin-skills-list error:', err);
    return error('Failed to fetch skills');
  }
};
