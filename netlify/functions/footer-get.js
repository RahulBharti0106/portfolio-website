// netlify/functions/footer-get.js
// GET /api/footer-get
// Public - no auth needed
// Returns footer settings + company links + projects + skills for footer columns

const pool = require('./_db');
const { ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  try {
    // Run all queries in parallel for speed
    const [settingsRes, linksRes, projectsRes, skillsRes, socialsRes] = await Promise.all([
      pool.query('SELECT * FROM footer_settings WHERE is_active = true LIMIT 1'),
      pool.query("SELECT * FROM footer_links WHERE is_visible = true AND column_name = 'company' ORDER BY display_order ASC"),
      pool.query('SELECT id, title FROM projects WHERE is_visible = true AND is_published = true ORDER BY display_order ASC LIMIT 5'),
      pool.query('SELECT id, name FROM skills WHERE is_visible = true ORDER BY display_order ASC LIMIT 6'),
      pool.query('SELECT * FROM social_links WHERE visible = true ORDER BY display_order ASC, id ASC'),
    ]);

    return ok({
      settings: settingsRes.rows[0] || null,
      companyLinks: linksRes.rows,
      projects: projectsRes.rows,
      skills: skillsRes.rows,
      socialLinks: socialsRes.rows,
    });

  } catch (err) {
    console.error('footer-get error:', err);
    return error('Failed to fetch footer data');
  }
};
