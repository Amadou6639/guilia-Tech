const pool = require("./config/database");

async function alterServicesTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("🔧 Modification de la table 'services'...");

    const columns = await conn.query("DESCRIBE services");
    const hasResponsableId = columns.some(
      (col) => col.Field === "responsable_id"
    );
    const hasDepartmentId = columns.some(
      (col) => col.Field === "department_id"
    );

    if (!hasResponsableId) {
      await conn.query(
        "ALTER TABLE services ADD COLUMN responsable_id INT NULL, ADD CONSTRAINT fk_responsable FOREIGN KEY (responsable_id) REFERENCES employees(id) ON DELETE SET NULL"
      );
      console.log("  ✅ Colonne 'responsable_id' ajoutée avec contrainte.");
    } else {
      console.log("  🟡 Colonne 'responsable_id' déjà présente.");
    }

    if (!hasDepartmentId) {
      await conn.query(
        "ALTER TABLE services ADD COLUMN department_id INT NULL, ADD CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL"
      );
      console.log("  ✅ Colonne 'department_id' ajoutée avec contrainte.");
    } else {
      console.log("  🟡 Colonne 'department_id' déjà présente.");
    }

    console.log(
      "🎉 Modification de la table 'services' terminée avec succès !"
    );
  } catch (err) {
    console.error(
      "❌ Erreur lors de la modification de la table 'services':",
      err
    );
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

alterServicesTable();
