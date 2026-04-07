const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Hackathon2026-27',
  password: 'JSHS2026',
  port: 5432,
});

(async () => {
  try {
    console.log('🔍 Checking database structure...\n');

    // Check table structure
    const result = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log('📋 Users table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(NOT NULL)' : ''} (default: ${row.column_default || 'null'})`);
    });

    console.log('\n👥 Checking user roles...');
    const roles = await pool.query(`
      SELECT
        role,
        COUNT(*) as count,
        COUNT(CASE WHEN registration_step = 'completed' THEN 1 END) as completed_registrations
      FROM users
      GROUP BY role
      ORDER BY role
    `);

    if (roles.rows.length === 0) {
      console.log('  No users found in database');
    } else {
      roles.rows.forEach(row => {
        console.log(`  - ${row.role}: ${row.count} users (${row.completed_registrations} completed registrations)`);
      });
    }

    // Check if role column exists
    const roleColumn = result.rows.find(col => col.column_name === 'role');
    if (roleColumn) {
      console.log('\n✅ Role column exists and is properly configured!');
    } else {
      console.log('\n❌ Role column not found. Migration may not have run.');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
})();