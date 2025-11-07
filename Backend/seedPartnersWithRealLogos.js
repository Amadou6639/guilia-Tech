const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  connectionLimit: 5
});

const partners = [
  { name: 'QuantumLeap', logo_url: 'https://logodust.com/img/logo-1.svg' },
  { name: 'StellarForge', logo_url: 'https://logodust.com/img/logo-2.svg' },
  { name: 'NexusWave', logo_url: 'https://logodust.com/img/logo-3.svg' },
  { name: 'Zenith Systems', logo_url: 'https://logodust.com/img/logo-4.svg' },
  { name: 'Apex Innovations', logo_url: 'https://logodust.com/img/logo-5.svg' }
];

async function seedPartners() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('🔧 Connexion à la base de données...');
    
    console.log('Suppression des anciens partenaires...');
    await conn.query("DELETE FROM partners");

    console.log('Insertion de nouveaux partenaires...');
    for (const partner of partners) {
      await conn.query("INSERT INTO partners (name, logo_url) VALUES (?, ?)", [partner.name, partner.logo_url]);
    }
    
    console.log('✅ Nouveaux partenaires insérés avec succès !');
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
    console.log('🔚 Connexion fermée');
  }
}

seedPartners();
