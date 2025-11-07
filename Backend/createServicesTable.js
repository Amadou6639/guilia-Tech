const pool = require("./config/database");

const createServicesTable = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('🔧 Création de la table "services"...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "services" créée avec succès.');
  } catch (err) {
    console.error('❌ Erreur lors de la création de la table "services":', err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
};

createServicesTable();
