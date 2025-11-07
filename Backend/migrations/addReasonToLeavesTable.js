const pool = require('../config/database');

async function addReasonToLeavesTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Adding reason column to leaves table...');
    await conn.query(`
      ALTER TABLE leaves
      ADD COLUMN reason TEXT NULL AFTER end_date;
    `);
    console.log('Reason column added to leaves table successfully.');
  } catch (error) {
    console.error('Error adding reason column to leaves table:', error);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
}

addReasonToLeavesTable();