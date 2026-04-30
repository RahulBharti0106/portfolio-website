// netlify/functions/social-list.js
// GET /api/social-list
// Public - no auth needed

const pool = require('./_db');
const { ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  try {
    const { rows } = await pool.query(
      'SELECT * FROM social_links WHERE visible = true ORDER BY display_order ASC, id ASC'
    );

    return ok(rows);
  } catch (err) {
    console.error('social-list error:', err);
    return error('Failed to fetch social links');
  }
};
