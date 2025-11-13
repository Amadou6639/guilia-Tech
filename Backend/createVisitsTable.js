const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'guilla_tech',
  connectionLimit: 5
});

async function createVisitsTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log('🔧 Connexion à la base de données...');
    
    // Crée la table visits
    console.log('🔧 Création de la table visits...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        referrer VARCHAR(500),
        INDEX page_index (page),
        INDEX timestamp_index (created_at)
      )
    `);
    
    console.log('✅ Table visits créée avec succès !');
    
    // Vérifie que la table existe
    const tables = await conn.query("SHOW TABLES LIKE 'visits'");
    if (tables.length > 0) {
      console.log('📊 Table visits vérifiée');
    }
    
    // Insère quelques données de test
    console.log('🔧 Insertion de données de test...');
    await conn.query(`
      INSERT INTO visits (page, ip_address, user_agent, referrer) VALUES
      ('/accueil', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://google.com'),
      ('/services', '192.168.1.2', 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', 'https://facebook.com'),
      ('/demandes', '192.168.1.3', 'Mozilla/5.0 (Linux; Android 10)', 'direct')
    `);
    
    console.log('✅ Données de test insérées !');
    
    // Affiche les données
    const visits = await conn.query('SELECT * FROM visits ORDER BY visit_timestamp DESC');
    console.log('📋 Données dans la table visits:');
    console.table(visits);
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
    console.log('🔚 Connexion fermée');
  }
}

createVisitsTable();
