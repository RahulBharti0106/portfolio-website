// netlify/functions/admin-project-create.js
// POST /api/admin-project-create

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return error('Method not allowed', 405);

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const {
      title, short_description, full_description, featured_image_url,
      tech_stack, github_url, live_demo_url, is_featured, is_published, is_visible
    } = JSON.parse(event.body);

    if (!title) return error('Title is required', 400);

    const { rows: countRows } = await pool.query('SELECT COUNT(*) FROM projects');
    const displayOrder = parseInt(countRows[0].count) + 1;

    // tech_stack arrives as comma-separated string from the form, convert to array
    const techArray = Array.isArray(tech_stack)
      ? tech_stack
      : (tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);

    const { rows } = await pool.query(
      `INSERT INTO projects (
        title, short_description, full_description, featured_image_url,
        tech_stack, github_url, live_demo_url, is_featured, is_published,
        is_visible, display_order
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [
        title, short_description, full_description, featured_image_url,
        techArray, github_url, live_demo_url,
        is_featured ?? false, is_published ?? true, is_visible ?? true,
        displayOrder
      ]
    );

    return ok(rows[0]);
  } catch (err) {
    console.error('admin-project-create error:', err);
    return error('Failed to create project');
  }
};
