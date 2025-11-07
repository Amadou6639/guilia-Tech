
const pool = require('./config/database');

async function alterTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected to the database.");

    await conn.query(`
      ALTER TABLE employees
      ADD COLUMN function_id INT NULL,
      ADD CONSTRAINT fk_function_id
      FOREIGN KEY (function_id)
      REFERENCES functions(id)
      ON DELETE SET NULL
    `);

    console.log("The 'function_id' column has been successfully added to the 'employees' table.");

  } catch (err) {
    console.error("Error altering the table:", err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

alterTable();
