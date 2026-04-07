const pool = require('./db');

async function addColumns() {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS category TEXT,
      ADD COLUMN IF NOT EXISTS organization TEXT,
      ADD COLUMN IF NOT EXISTS organization_address TEXT,
      ADD COLUMN IF NOT EXISTS project_investigator_name TEXT,
      ADD COLUMN IF NOT EXISTS project_investigator_designation TEXT,
      ADD COLUMN IF NOT EXISTS partner_organization TEXT,
      ADD COLUMN IF NOT EXISTS partner_address TEXT,
      ADD COLUMN IF NOT EXISTS partner_investigator_name TEXT,
      ADD COLUMN IF NOT EXISTS partner_investigator_email TEXT,
      ADD COLUMN IF NOT EXISTS partner_investigator_mobile TEXT,
      ADD COLUMN IF NOT EXISTS proposal_title TEXT,
      ADD COLUMN IF NOT EXISTS problem_statement TEXT,
      ADD COLUMN IF NOT EXISTS additional_info TEXT;
    `);
    console.log('Columns added successfully');
  } catch (err) {
    console.error('Error adding columns:', err);
  } finally {
    pool.end();
  }
}

addColumns();