const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  user: process.env.MYSQLUSER || process.env.DB_USER || "amadou",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "66396816",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "guilla_tech",
  ssl: process.env.MYSQL_SSL === 'true',
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  connectionLimit: 10,
  acquireTimeout: 30000,
  timeout: 30000,
  reconnect: true,
  queueLimit: 0
});

// Test de la connexion amélioré
pool
  .getConnection()
  .then((conn) => {
    console.log("🔗 Tentative de connexion à la base de données...");
    return conn.query("SELECT DATABASE() as db_name, NOW() as server_time")
      .then((rows) => {
        console.log(`✅ Connecté à MySQL Aiven avec mysql2!`);
        console.log(`📊 Base de données: ${rows[0].db_name}`);
        console.log(`⏰ Heure du serveur: ${rows[0].server_time}`);
        console.log(`🌐 Hôte: ${process.env.MYSQLHOST || 'localhost'}`);
      })
      .finally(() => {
        conn.release();
      });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MySQL:", err.message);
    console.error("📌 Code erreur:", err.code);
    console.log("🔍 Variables d'environnement disponibles:");
    console.log("- MYSQLHOST:", process.env.MYSQLHOST ? "✓ Défini" : "✗ Non défini");
    console.log("- MYSQLUSER:", process.env.MYSQLUSER ? "✓ Défini" : "✗ Non défini");
    console.log("- MYSQLDATABASE:", process.env.MYSQLDATABASE ? "✓ Défini" : "✗ Non défini");
    console.log("- MYSQLPORT:", process.env.MYSQLPORT ? "✓ Défini" : "✗ Non défini");
  });

module.exports = pool;