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
    console.log('🔍 Your User Data in Database:\n');

    // Get all usernames for reference
    const allUsers = await pool.query('SELECT username, full_name, email, role FROM users ORDER BY created_at DESC LIMIT 10');
    console.log('📋 Recent Users:');
    allUsers.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} - ${user.full_name} (${user.email}) [${user.role}]`);
    });

    console.log('\n💡 To see YOUR specific data, use this query in pgAdmin:');
    console.log("SELECT * FROM users WHERE username = 'YOUR_USERNAME_HERE';");

    console.log('\n📊 To see all users (admin only):');
    console.log('SELECT username, full_name, email, role, registration_step FROM users ORDER BY created_at DESC;');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
})();