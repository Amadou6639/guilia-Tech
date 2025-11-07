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
  { name: 'QuantumLeap', website_url: 'https://example.com/quantumleap', logo_svg: '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="100%" height="100%" fill="#0000FF" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-size="20">QuantumLeap</text></svg>' },
  { name: 'StellarForge', website_url: 'https://example.com/stellarforge', logo_svg: '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="100%" height="100%" fill="#FF0000" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-size="20">StellarForge</text></svg>' },
  { name: 'NexusWave', website_url: 'https://example.com/nexuswave', logo_svg: '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="100%" height="100%" fill="#00FF00" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-size="20">NexusWave</text></svg>' },
  { name: 'Zenith Systems', website_url: 'https://example.com/zenith', logo_svg: '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="100%" height="100%" fill="#FFFF00" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#000000" font-size="20">Zenith</text></svg>' },
  { name: 'Apex Innovations', website_url: 'https://example.com/apex', logo_svg: '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="100%" height="100%" fill="#800080" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-size="20">Apex</text></svg>' }
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
      const logo_url = `data:image/svg+xml;base64,${Buffer.from(partner.logo_svg).toString('base64')}`;
      await conn.query("INSERT INTO partners (name, logo_url, website_url) VALUES (?, ?, ?)", [partner.name, logo_url, partner.website_url]);
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