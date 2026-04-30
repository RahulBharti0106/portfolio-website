// netlify/functions/projects-list.js
// GET /api/projects-list
// Public - no auth needed
// Returns published + visible projects ordered by display_order

const pool = require('./_db');
const { ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  try {
    const { rows } = await pool.query(
      `SELECT * FROM projects 
       WHERE is_visible = true AND is_published = true 
       ORDER BY display_order ASC`
    );

    return ok(rows);
  } catch (err) {
    console.error('projects-list error:', err);
    return error('Failed to fetch projects');
  }
};
