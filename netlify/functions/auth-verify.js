// netlify/functions/auth-verify.js
// GET /api/auth-verify
// Used by React's ProtectedRoute to check if token is still valid
// Send token in Authorization header: "Bearer <token>"

const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  return ok({ valid: true, email: auth.payload.email });
};
