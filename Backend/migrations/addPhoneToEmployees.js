const pool = require('../config/database');

async function addPhoneToEmployees() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Adding phone column to employees table...');
    await conn.query(`
      ALTER TABLE employees
      ADD COLUMN phone VARCHAR(20) NULL AFTER position;
    `);
    console.log('Phone column added to employees table successfully.');
  } catch (error) {
    console.error('Error adding phone column to employees table:', error);
  } finally {
    if (conn) conn.release();
  }
}

addPhoneToEmployees();