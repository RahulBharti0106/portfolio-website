// netlify/functions/admin-social-create.js
// POST /api/admin-social-create

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return error('Method not allowed', 405);

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const { platform, url, icon, visible } = JSON.parse(event.body);
    if (!platform || !url) return error('Platform and URL are required', 400);

    const { rows } = await pool.query(
      `INSERT INTO social_links (platform, url, icon, visible, is_visible)
       VALUES ($1, $2, $3, $4, $4) RETURNING *`,
      [platform, url, icon || 'FiLink', visible ?? true]
    );

    return ok(rows[0]);
  } catch (err) {
    console.error('admin-social-create error:', err);
    return error('Failed to create social link');
  }
};
