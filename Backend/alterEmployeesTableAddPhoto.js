const pool = require('./config/database');

async function alterTable() {
  const connection = await pool.getConnection();
  try {
    console.log('Altering employees table to add photo_url...');
    await connection.query('ALTER TABLE employees ADD COLUMN photo_url VARCHAR(255) NULL AFTER email');
    console.log('Table altered successfully.');
  } catch (error) {
    console.error('Error altering table:', error);
  } finally {
    connection.release();
    pool.end();
  }
}

alterTable();