const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  connectionLimit: 5
});

async function createSubscribersTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log('🔧 Connexion à la base de données...');
    
    console.log('🔧 Création de la table subscribers...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        token VARCHAR(255) NOT NULL,
        confirmed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Table subscribers créée avec succès !');
    
    const tables = await conn.query("SHOW TABLES LIKE 'subscribers'");
    if (tables.length > 0) {
      console.log('📊 Table subscribers vérifiée');
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
    console.log('🔚 Connexion fermée');
  }
}

createSubscribersTable();
