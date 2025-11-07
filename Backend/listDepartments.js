const pool = require('./config/database');

async function listDepartments() {
  let conn;
  try {
    conn = await pool.getConnection();
    const departments = await conn.query("SELECT id, name FROM departments");
    console.log("Liste des départements :");
    console.table(departments);
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

listDepartments();
