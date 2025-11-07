const pool = require('./config/database');

async function listEmployees() {
  let conn;
  try {
    conn = await pool.getConnection();
    const employees = await conn.query("SELECT id, name, service_id FROM employees");
    console.log("Liste des employés :");
    console.table(employees);
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

listEmployees();
