const pool = require('../config/database');

async function addAddressToEmployees() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Adding address column to employees table...');
    await conn.query(`
      ALTER TABLE employees
      ADD COLUMN address VARCHAR(255) NULL AFTER phone;
    `);
    console.log('Address column added to employees table successfully.');
  } catch (error) {
    console.error('Error adding address column to employees table:', error);
  } finally {
    if (conn) conn.release();
  }
}

addAddressToEmployees();