// netlify/functions/contact-submit.js
const pool = require('./_db');
const { ok, error, handleOptions } = require('./_auth');

// Simple in-memory rate limiter
// Resets when the function cold-starts (good enough for serverless)
const rateLimitMap = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 3;       // max 3 submissions per IP per minute

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return false;
  }

  // Reset window if expired
  if (now - record.startTime > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return false;
  }

  // Within window - check count
  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return error('Method not allowed', 405);

  // Get IP from Netlify headers
  const ip =
    event.headers['x-forwarded-for']?.split(',')[0].trim() ||
    event.headers['client-ip'] ||
    'unknown';

  if (isRateLimited(ip)) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Too many requests. Please wait a minute before trying again.' }),
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    if (!name || !email || !message) {
      return error('Name, email and message are required', 400);
    }

    if (name.trim().length < 2) {
      return error('Name must be at least 2 characters', 400);
    }

    if (message.trim().length < 10) {
      return error('Message must be at least 10 characters', 400);
    }

    if (message.trim().length > 5000) {
      return error('Message is too long (max 5000 characters)', 400);
    }

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