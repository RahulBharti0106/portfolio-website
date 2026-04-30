// netlify/functions/_db.js
// Shared PostgreSQL connection - used by ALL functions
// The underscore prefix means Netlify won't expose this as an API endpoint

const { Pool } = require('pg');

// Create ONE connection pool reused across function calls
// This is important for performance - don't create a new pool every request
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon
  max: 5,          // max 5 connections at once (Neon free tier limit)
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

module.exports = pool;
