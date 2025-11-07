const pool = require('./config/database');

async function alterTable() {
  const connection = await pool.getConnection();
  try {
    console.log('Altering departments table to add image...');
    await connection.query('ALTER TABLE departments ADD COLUMN image VARCHAR(255) NULL AFTER description');
    console.log('Table altered successfully.');
  } catch (error) {
    console.error('Error altering table:', error);
  } finally {
    connection.release();
    pool.end();
  }
}

alterTable();
