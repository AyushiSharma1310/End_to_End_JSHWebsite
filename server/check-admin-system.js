const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hackathon2026_27',
  password: 'JSHS2026',
  port: 5432,
});

(async () => {
  try {
    console.log('🔍 Checking Enhanced Admin System...\n');

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

    console.log('\n👥 Admin Access Status:');
    const admins = await pool.query(`
      SELECT username, full_name, role, dashboard_access
      FROM users
      WHERE role = 'admin'
      ORDER BY created_at DESC
    `);

    if (admins.rows.length === 0) {
      console.log('  No admin users found');
    } else {
      admins.rows.forEach((admin) => {
        console.log(`  - ${admin.username}: ${admin.full_name} [Dashboard Access: ${admin.dashboard_access ? '✅ Granted' : '❌ Revoked'}]`);
      });
    }

    console.log('\n📊 User Role Distribution:');
    const roles = await pool.query(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
      ORDER BY role
    `);

    roles.rows.forEach(row => {
      console.log(`  - ${row.role}: ${row.count} users`);
    });

    // Check if dashboard_access column exists
    const dashboardColumn = result.rows.find(col => col.column_name === 'dashboard_access');
    if (dashboardColumn) {
      console.log('\n✅ Dashboard access system is properly configured!');
      console.log('💡 Only admins with dashboard_access = true can view the admin dashboard');
    } else {
      console.log('\n❌ Dashboard access column not found. Migration may not have run.');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
})();