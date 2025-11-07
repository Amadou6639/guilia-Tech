
const pool = require('./config/database');

async function alterTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected to the database.");

    // Add the 'address' column to the 'employees' table
    await conn.query(`
      ALTER TABLE employees
      ADD COLUMN address VARCHAR(255) NULL
    `);

    console.log("The 'address' column has been successfully added to the 'employees' table.");

  } catch (err) {
    console.error("Error altering the table:", err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

alterTable();
