// netlify/functions/admin-project-update.js
// PUT /api/admin-project-update

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'PUT') return error('Method not allowed', 405);

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const {
      id, title, short_description, full_description, featured_image_url,
      tech_stack, github_url, live_demo_url, is_featured, is_published, is_visible
    } = JSON.parse(event.body);

    if (!id) return error('Project ID is required', 400);

    const techArray = Array.isArray(tech_stack)
      ? tech_stack
      : (tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);

    const { rows } = await pool.query(
      `UPDATE projects SET
        title=$1, short_description=$2, full_description=$3, featured_image_url=$4,
        tech_stack=$5, github_url=$6, live_demo_url=$7, is_featured=$8,
        is_published=$9, is_visible=$10, updated_at=now()
       WHERE id=$11
       RETURNING *`,
      [
        title, short_description, full_description, featured_image_url,
        techArray, github_url, live_demo_url,
        is_featured, is_published, is_visible, id
      ]
    );

    if (rows.length === 0) return error('Project not found', 404);
    return ok(rows[0]);
  } catch (err) {
    console.error('admin-project-update error:', err);
    return error('Failed to update project');
  }
};
