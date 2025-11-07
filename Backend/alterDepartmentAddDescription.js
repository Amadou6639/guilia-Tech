const pool = require('./config/database');

async function alterTable() {
  const connection = await pool.getConnection();
  try {
    console.log('Altering departments table to add description...');
    await connection.query('ALTER TABLE departments ADD COLUMN description TEXT NULL AFTER name');
    console.log('Table altered successfully.');
  } catch (error) {
    console.error('Error altering table:', error);
  } finally {
    connection.release();
    pool.end();
  }
}

alterTable();