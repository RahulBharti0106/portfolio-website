// netlify/functions/admin-message-update.js
// PUT /api/admin-message-update
// Used to mark as read, star, archive

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'PUT') return error('Method not allowed', 405);

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const { id, is_read, is_starred, is_archived } = JSON.parse(event.body);
    if (!id) return error('Message ID is required', 400);

    // Only update fields that were actually sent
    const updates = [];
    const values = [];
    let i = 1;

    if (is_read !== undefined)     { updates.push(`is_read = $${i++}`);     values.push(is_read); }
    if (is_starred !== undefined)  { updates.push(`is_starred = $${i++}`);  values.push(is_starred); }
    if (is_archived !== undefined) { updates.push(`is_archived = $${i++}`); values.push(is_archived); }

    if (updates.length === 0) return error('Nothing to update', 400);

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE contact_messages SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );

    if (rows.length === 0) return error('Message not found', 404);
    return ok(rows[0]);
  } catch (err) {
    console.error('admin-message-update error:', err);
    return error('Failed to update message');
  }
};
