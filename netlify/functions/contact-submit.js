// netlify/functions/contact-submit.js
// POST /api/contact-submit
// Public - no auth needed
// Body: { name, email, subject, message }

const pool = require('./_db');
const { ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return error('Method not allowed', 405);

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    // Basic validation
    if (!name || !email || !message) {
      return error('Name, email and message are required', 400);
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return error('Invalid email address', 400);
    }

    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)`,
      [name.trim(), email.trim(), subject?.trim() || null, message.trim()]
    );

    return ok({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('contact-submit error:', err);
    return error('Failed to send message');
  }
};
