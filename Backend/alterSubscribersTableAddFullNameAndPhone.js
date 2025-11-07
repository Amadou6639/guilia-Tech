const pool = require('./config/database');

async function alterSubscribersTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`
      ALTER TABLE subscribers
      ADD COLUMN full_name VARCHAR(255) NULL AFTER email,
      ADD COLUMN phone_number VARCHAR(20) NULL AFTER full_name;
    `);
    console.log('Table subscribers altered successfully: added full_name and phone_number columns.');
  } catch (err) {
    console.error('Error altering subscribers table:', err);
  } finally {
    if (conn) conn.release();
  }
}

alterSubscribersTable();
