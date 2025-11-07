const pool = require('./config/database');

async function alterTable() {
  const connection = await pool.getConnection();
  try {
    console.log('Altering employees table to add age, experience, and remaining_leaves...');
    await connection.query('ALTER TABLE employees ADD COLUMN age INT NULL AFTER position');
    await connection.query('ALTER TABLE employees ADD COLUMN experience INT NULL AFTER age');
    await connection.query('ALTER TABLE employees ADD COLUMN remaining_leaves INT NULL AFTER experience');
    console.log('Table altered successfully.');
  } catch (error) {
    console.error('Error altering table:', error);
  } finally {
    connection.release();
    pool.end();
  }
}

alterTable();
