// netlify/functions/admin-social-update.js
// PUT /api/admin-social-update

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'PUT') return error('Method not allowed', 405);

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const { id, platform, url, icon, visible } = JSON.parse(event.body);
    if (!id) return error('ID is required', 400);

    const { rows } = await pool.query(
      `UPDATE social_links SET platform=$1, url=$2, icon=$3, visible=$4, is_visible=$4
       WHERE id=$5 RETURNING *`,
      [platform, url, icon, visible, id]
    );

    if (rows.length === 0) return error('Social link not found', 404);
    return ok(rows[0]);
  } catch (err) {
    return error('Failed to update social link');
  }
};
