const pool = require('../config/database');

async function alterLeavesTableModifyType() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Altering leaves table to modify type column...');
    await conn.query(`
      ALTER TABLE leaves
      MODIFY COLUMN type VARCHAR(255) NULL;
    `);
    console.log('Leaves table altered successfully.');
  } catch (error) {
    console.error('Error altering leaves table:', error);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
}

alterLeavesTableModifyType();