
const pool = require("./config/database");

const alterServicesTable = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('🔧 Modification de la table "services" pour ajouter manager_id...');
    await conn.query(`
      ALTER TABLE services
      ADD COLUMN manager_id INT,
      ADD FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;
    `);
    console.log('✅ Table "services" modifiée avec succès.');
  } catch (err) {
    console.error('❌ Erreur lors de la modification de la table "services":', err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
};

alterServicesTable();
