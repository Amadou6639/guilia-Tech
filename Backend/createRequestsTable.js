const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  connectionLimit: 5
});

async function createRequestsTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log('🔧 Connexion à la base de données...');
    
    console.log('🔧 Création de la table requests...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        tel VARCHAR(255) NOT NULL,
        besoin TEXT NOT NULL,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Table requests créée avec succès !');
    
    const tables = await conn.query("SHOW TABLES LIKE 'requests'");
    if (tables.length > 0) {
      console.log('📊 Table requests vérifiée');
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
    console.log('🔚 Connexion fermée');
  }
}

createRequestsTable();
