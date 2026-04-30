// netlify/functions/admin-messages-list.js
// GET /api/admin-messages-list

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    return ok(rows);
  } catch (err) {
    console.error('admin-messages-list error:', err);
    return error('Failed to fetch messages');
  }
};
