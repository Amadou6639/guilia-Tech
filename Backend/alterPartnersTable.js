const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  connectionLimit: 5
});

async function alterPartnersTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('🔧 Connexion à la base de données...');
    
    console.log('Modification de la table partners...');
    await conn.query("ALTER TABLE partners MODIFY COLUMN logo_url TEXT");
    
    console.log('✅ Table partners modifiée avec succès !');
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
    console.log('🔚 Connexion fermée');
  }
}

alterPartnersTable();
