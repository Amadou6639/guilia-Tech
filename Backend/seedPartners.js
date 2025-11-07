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
  { name: 'Tech Solutions Inc.', logo_url: 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=Tech+Solutions' },
  { name: 'Innovate Corp.', logo_url: 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Innovate+Corp' },
  { name: 'Digital Future', logo_url: 'https://via.placeholder.com/150/00FF00/FFFFFF?Text=Digital+Future' },
  { name: 'Cloud Services Ltd.', logo_url: 'https://via.placeholder.com/150/FFFF00/000000?Text=Cloud+Services' },
  { name: 'CyberSafe', logo_url: 'https://via.placeholder.com/150/800080/FFFFFF?Text=CyberSafe' }
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
