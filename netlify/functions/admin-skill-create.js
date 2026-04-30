// netlify/functions/admin-skill-create.js
// POST /api/admin-skill-create
// Protected

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return error('Method not allowed', 405);

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const { name, icon, category, description, is_visible } = JSON.parse(event.body);

    if (!name || !category) return error('Name and category are required', 400);

    // Get current max display_order to put new skill at the end
    const { rows: countRows } = await pool.query('SELECT COUNT(*) FROM skills');
    const displayOrder = parseInt(countRows[0].count) + 1;

    const { rows } = await pool.query(
      `INSERT INTO skills (name, icon, category, description, is_visible, display_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, icon || 'FaCode', category, description || null, is_visible ?? true, displayOrder]
    );

    return ok(rows[0]);
  } catch (err) {
    console.error('admin-skill-create error:', err);
    return error('Failed to create skill');
  }
};
