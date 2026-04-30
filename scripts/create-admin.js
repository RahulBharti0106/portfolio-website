// scripts/create-admin.js
// Run this ONCE to add your admin account to the database
// Usage: node scripts/create-admin.js
//
// Make sure your .env file has DATABASE_URL set before running this!

import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Helper to ask questions in terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function createAdmin() {
  console.log('\n=== Create Admin User ===\n');

  try {
    // Check if admin already exists
    const { rows: existing } = await pool.query('SELECT email FROM admin_users');
    if (existing.length > 0) {
      console.log('⚠️  An admin user already exists:');
      existing.forEach(u => console.log('   -', u.email));
      const overwrite = await ask('\nDo you want to add another admin? (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('Cancelled.');
        process.exit(0);
      }
    }

    const email = await ask('Enter admin email: ');
    const password = await ask('Enter admin password (min 8 characters): ');

    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    // Hash the password with bcrypt (12 rounds = very secure)
    console.log('\nHashing password...');
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert into database
    const { rows } = await pool.query(
      `INSERT INTO admin_users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id, email, created_at`,
      [email.toLowerCase().trim(), passwordHash]
    );

    console.log('\n✅ Admin user created successfully!');
    console.log('   Email:', rows[0].email);
    console.log('   ID:', rows[0].id);
    console.log('\nYou can now log in at /admin/login with these credentials.\n');

  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
  }
}

createAdmin();
