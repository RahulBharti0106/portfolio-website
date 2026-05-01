// netlify/functions/_auth.js
// Shared JWT verification - used by all admin functions
// Call verifyToken(event) at the top of any protected function

const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set');
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Call this in every admin function to check the JWT token
// Returns { valid: true, payload } or sends a 401 response object
function verifyToken(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      valid: false,
      response: {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'No token provided' }),
      },
    };
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, payload };
  } catch (err) {
    return {
      valid: false,
      response: {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid or expired token' }),
      },
    };
  }
}

// Standard success response
function ok(data) {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(data),
  };
}

// Standard error response
function error(message, statusCode = 500) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: message }),
  };
}

// Handle CORS preflight requests (browsers send these before POST/PUT/DELETE)
function handleOptions() {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: '',
  };
}

module.exports = { verifyToken, ok, error, handleOptions, CORS_HEADERS };
