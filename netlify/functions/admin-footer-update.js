// netlify/functions/admin-footer-update.js
// PUT /api/admin-footer-update
// Updates footer settings AND handles company links (create/update/delete)

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  // GET: return current footer settings + links
  if (event.httpMethod === 'GET') {
    try {
      const [settingsRes, linksRes] = await Promise.all([
        pool.query('SELECT * FROM footer_settings WHERE is_active = true LIMIT 1'),
        pool.query("SELECT * FROM footer_links WHERE column_name = 'company' ORDER BY display_order ASC"),
      ]);
      return ok({ settings: settingsRes.rows[0] || null, links: linksRes.rows });
    } catch (err) {
      return error('Failed to fetch footer data');
    }
  }

  // PUT: update footer settings
  if (event.httpMethod === 'PUT') {
    try {
      const {
        brand_name, description, copyright_text,
        show_product_column, product_column_title,
        show_resources_column, resources_column_title,
        show_company_column, company_column_title
      } = JSON.parse(event.body);

      const { rows: existing } = await pool.query(
        'SELECT id FROM footer_settings WHERE is_active = true LIMIT 1'
      );

      let result;
      if (existing.length > 0) {
        const { rows } = await pool.query(
          `UPDATE footer_settings SET
            brand_name=$1, description=$2, copyright_text=$3,
            show_product_column=$4, product_column_title=$5,
            show_resources_column=$6, resources_column_title=$7,
            show_company_column=$8, company_column_title=$9, updated_at=now()
           WHERE id=$10 RETURNING *`,
          [
            brand_name, description, copyright_text,
            show_product_column, product_column_title,
            show_resources_column, resources_column_title,
            show_company_column, company_column_title,
            existing[0].id
          ]
        );
        result = rows[0];
      } else {
        const { rows } = await pool.query(
          `INSERT INTO footer_settings (
            brand_name, description, copyright_text,
            show_product_column, product_column_title,
            show_resources_column, resources_column_title,
            show_company_column, company_column_title, is_active
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true) RETURNING *`,
          [
            brand_name, description, copyright_text,
            show_product_column, product_column_title,
            show_resources_column, resources_column_title,
            show_company_column, company_column_title
          ]
        );
        result = rows[0];
      }

      return ok(result);
    } catch (err) {
      console.error('admin-footer-update error:', err);
      return error('Failed to update footer settings');
    }
  }

  // POST: create a new footer link
  if (event.httpMethod === 'POST') {
    try {
      const { label, url, is_visible } = JSON.parse(event.body);
      if (!label || !url) return error('Label and URL are required', 400);

      const { rows: countRows } = await pool.query("SELECT COUNT(*) FROM footer_links WHERE column_name = 'company'");
      const displayOrder = parseInt(countRows[0].count) + 1;

      const { rows } = await pool.query(
        `INSERT INTO footer_links (label, url, column_name, is_visible, display_order)
         VALUES ($1, $2, 'company', $3, $4) RETURNING *`,
        [label, url, is_visible ?? true, displayOrder]
      );

      return ok(rows[0]);
    } catch (err) {
      return error('Failed to create footer link');
    }
  }

  // DELETE: remove a footer link
  if (event.httpMethod === 'DELETE') {
    try {
      const { id } = JSON.parse(event.body);
      if (!id) return error('ID is required', 400);

      await pool.query('DELETE FROM footer_links WHERE id = $1', [id]);
      return ok({ success: true });
    } catch (err) {
      return error('Failed to delete footer link');
    }
  }

  return error('Method not allowed', 405);
};
