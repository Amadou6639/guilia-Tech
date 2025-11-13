const mariadb = require('mariadb');
require('dotenv').config({ path: './.env' });

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'guilla_tech',
  connectionLimit: 5
});

async function checkVisitsTableSchema() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connected to database.');

    console.log('Describing visits table...');
    const rows = await conn.query('DESCRIBE visits');
    console.log('Visits table schema:');
    console.table(rows);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
    console.log('Database connection closed.');
  }
}

checkVisitsTableSchema();
