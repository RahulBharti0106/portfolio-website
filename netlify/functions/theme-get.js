// netlify/functions/theme-get.js
// GET /api/theme-get
// Public - no auth needed

const pool = require('./_db');
const { ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  try {
    const { rows } = await pool.query(
      'SELECT * FROM themes WHERE is_active = true LIMIT 1'
    );

    if (rows.length === 0) return ok(null);
    return ok(rows[0]);
  } catch (err) {
    console.error('theme-get error:', err);
    return error('Failed to fetch theme');
  }
};
