// netlify/functions/admin-skill-update.js
// PUT /api/admin-skill-update
// Protected
// Body must include: id

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'PUT') return error('Method not allowed', 405);

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const { id, name, icon, category, description, is_visible } = JSON.parse(event.body);

    if (!id) return error('Skill ID is required', 400);

    const { rows } = await pool.query(
      `UPDATE skills SET
        name = $1, icon = $2, category = $3, description = $4,
        is_visible = $5, updated_at = now()
       WHERE id = $6
       RETURNING *`,
      [name, icon, category, description, is_visible, id]
    );

    if (rows.length === 0) return error('Skill not found', 404);
    return ok(rows[0]);
  } catch (err) {
    console.error('admin-skill-update error:', err);
    return error('Failed to update skill');
  }
};
