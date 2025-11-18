const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 60000,
  idleTimeoutMillis: 60000,
  max: 10
});

// Test de connexion amélioré
pool.query('SELECT NOW() as server_time, current_database() as db_name')
  .then((result) => {
    console.log(`✅ Connecté à PostgreSQL sur Render!`);
    console.log(`📊 Base de données: ${result.rows[0].db_name}`);
    console.log(`⏰ Heure du serveur: ${result.rows[0].server_time}`);
    console.log(`🌐 Utilisation de PostgreSQL avec DATABASE_URL`);
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion PostgreSQL:", err.message);
    console.log("🔍 DATABASE_URL disponible:", process.env.DATABASE_URL ? "✓ Oui" : "✗ Non");
    console.log("🔍 Variables d'environnement disponibles:");
    console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "✓ Défini" : "✗ Non défini");
    console.log("- NODE_ENV:", process.env.NODE_ENV || 'non défini');
  });

module.exports = pool;