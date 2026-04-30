// netlify/functions/admin-profile-update.js
// PUT /api/admin-profile-update
// Protected - requires JWT token

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'PUT') return error('Method not allowed', 405);

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const {
      name, tagline, short_bio, bio_about,
      about_visible, location, email,
      avatar_url, banner_url, degree, status,
    } = JSON.parse(event.body);

    const { rows: existing } = await pool.query('SELECT id FROM profile LIMIT 1');
    if (existing.length === 0) return error('Profile not found', 404);

    const { rows } = await pool.query(
      `UPDATE profile SET
        name = $1, tagline = $2, short_bio = $3, bio_about = $4,
        about_visible = $5, location = $6, email = $7,
        avatar_url = $8, banner_url = $9, degree = $10, status = $11,
        updated_at = now()
       WHERE id = $12
       RETURNING *`,
      [
        name, tagline, short_bio, bio_about,
        about_visible, location, email,
        avatar_url || '', banner_url || '', degree || '', status || '',
        existing[0].id,
      ]
    );

    return ok(rows[0]);
  } catch (err) {
    console.error('admin-profile-update error:', err);
    return error('Failed to update profile');
  }
};