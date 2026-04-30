// netlify/functions/admin-message-delete.js
// DELETE /api/admin-message-delete

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'DELETE') return error('Method not allowed', 405);

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const { id } = JSON.parse(event.body);
    if (!id) return error('Message ID is required', 400);

    const { rowCount } = await pool.query('DELETE FROM contact_messages WHERE id = $1', [id]);
    if (rowCount === 0) return error('Message not found', 404);

    return ok({ success: true });
  } catch (err) {
    console.error('admin-message-delete error:', err);
    return error('Failed to delete message');
  }
};
