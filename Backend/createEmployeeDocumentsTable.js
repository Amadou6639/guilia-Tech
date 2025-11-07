const pool = require("./config/database");

async function createTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("📄 Création de la table 'employee_documents'...");
    await conn.query(`
      CREATE TABLE IF NOT EXISTS employee_documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Table 'employee_documents' créée ou déjà existante.");
  } catch (err) {
    console.error(
      "❌ Erreur lors de la création de la table 'employee_documents':",
      err
    );
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

createTable();
