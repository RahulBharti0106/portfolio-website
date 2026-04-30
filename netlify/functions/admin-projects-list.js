// netlify/functions/admin-projects-list.js
// GET /api/admin-projects-list — returns ALL projects including hidden

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY display_order ASC');
    return ok(rows);
  } catch (err) {
    console.error('admin-projects-list error:', err);
    return error('Failed to fetch projects');
  }
};
