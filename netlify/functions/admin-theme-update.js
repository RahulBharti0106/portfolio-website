// netlify/functions/admin-theme-update.js
// PUT /api/admin-theme-update

const pool = require('./_db');
const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'PUT') return error('Method not allowed', 405);

  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  try {
    const {
      dark_bg_primary, dark_bg_secondary, dark_accent, dark_text_primary, dark_text_secondary,
      light_bg_primary, light_bg_secondary, light_accent, light_text_primary, light_text_secondary
    } = JSON.parse(event.body);

    // Check if an active theme exists
    const { rows: existing } = await pool.query(
      'SELECT id FROM themes WHERE is_active = true LIMIT 1'
    );

    let result;
    if (existing.length > 0) {
      const { rows } = await pool.query(
        `UPDATE themes SET
          dark_bg_primary=$1, dark_bg_secondary=$2, dark_accent=$3,
          dark_text_primary=$4, dark_text_secondary=$5,
          light_bg_primary=$6, light_bg_secondary=$7, light_accent=$8,
          light_text_primary=$9, light_text_secondary=$10, updated_at=now()
         WHERE id=$11 RETURNING *`,
        [
          dark_bg_primary, dark_bg_secondary, dark_accent, dark_text_primary, dark_text_secondary,
          light_bg_primary, light_bg_secondary, light_accent, light_text_primary, light_text_secondary,
          existing[0].id
        ]
      );
      result = rows[0];
    } else {
      const { rows } = await pool.query(
        `INSERT INTO themes (
          name, is_active,
          dark_bg_primary, dark_bg_secondary, dark_accent, dark_text_primary, dark_text_secondary,
          light_bg_primary, light_bg_secondary, light_accent, light_text_primary, light_text_secondary
        ) VALUES ('Default', true, $1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [
          dark_bg_primary, dark_bg_secondary, dark_accent, dark_text_primary, dark_text_secondary,
          light_bg_primary, light_bg_secondary, light_accent, light_text_primary, light_text_secondary
        ]
      );
      result = rows[0];
    }

    return ok(result);
  } catch (err) {
    console.error('admin-theme-update error:', err);
    return error('Failed to update theme');
  }
};
