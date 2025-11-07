const pool = require('../config/database');

async function addDepartmentIdToEmployees() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Adding department_id column to employees table...');
    await conn.query(`
      ALTER TABLE employees
      ADD COLUMN department_id BIGINT UNSIGNED NULL,
      ADD CONSTRAINT fk_department
      FOREIGN KEY (department_id) REFERENCES departments(id)
      ON DELETE SET NULL;
    `);
    console.log('department_id column added to employees table successfully.');
  } catch (error) {
    console.error('Error adding department_id column to employees table:', error);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
}

addDepartmentIdToEmployees();