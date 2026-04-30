// netlify/functions/admin-social-list.js
// GET /api/admin-social-list — all social links including hidden

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const { rows } = await pool.query('SELECT * FROM social_links ORDER BY display_order ASC, id ASC');
    return ok(rows);
  } catch (err) {
    return error('Failed to fetch social links');
  }
};
