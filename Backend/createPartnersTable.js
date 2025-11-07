const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  connectionLimit: 5
});

async function createPartnersTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log('🔧 Connexion à la base de données...');
    
    console.log('🔧 Création de la table partners...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(255)
      )
    `);
    
    console.log('✅ Table partners créée avec succès !');
    
    const tables = await conn.query("SHOW TABLES LIKE 'partners'");
    if (tables.length > 0) {
      console.log('📊 Table partners vérifiée');
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
    console.log('🔚 Connexion fermée');
  }
}

createPartnersTable();
