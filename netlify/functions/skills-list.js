// netlify/functions/skills-list.js
// GET /api/skills-list
// Public - no auth needed
// Returns visible skills ordered by display_order

const pool = require('./_db');
const { ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  try {
    const { rows } = await pool.query(
      'SELECT * FROM skills WHERE is_visible = true ORDER BY display_order ASC'
    );

    return ok(rows);
  } catch (err) {
    console.error('skills-list error:', err);
    return error('Failed to fetch skills');
  }
};
