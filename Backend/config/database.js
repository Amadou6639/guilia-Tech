const mysql = require("mysql2/promise");

// Fonction pour parser DATABASE_URL
function parseDatabaseUrl(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
      port: parseInt(url.port) || 3306,
      ssl: url.searchParams.get('ssl-mode') === 'REQUIRED' ? { rejectUnauthorized: false } : undefined
    };
  } catch (error) {
    console.error("❌ Erreur parsing DATABASE_URL:", error.message);
    return null;
  }
}

// Configuration de la base de données
let dbConfig = {
  host: "localhost",
  user: "amadou", 
  password: "66396816",
  database: "guilla_tech",
  port: 3306,
  connectionLimit: 10,
  acquireTimeout: 30000,
  timeout: 30000,
  reconnect: true,
  queueLimit: 0
};

// Utiliser DATABASE_URL d'Aiven si disponible
if (process.env.DATABASE_URL) {
  console.log("🔗 Utilisation de DATABASE_URL Aiven");
  const aivenConfig = parseDatabaseUrl(process.env.DATABASE_URL);
  if (aivenConfig) {
    dbConfig = {
      ...dbConfig,
      ...aivenConfig
    };
  }
} else {
  console.log("⚠️ Utilisation des variables MYSQL* ou configuration par défaut");
  // Fallback aux variables MYSQL*
  dbConfig = {
    ...dbConfig,
    host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
    user: process.env.MYSQLUSER || process.env.DB_USER || "amadou",
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "66396816",
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || "guilla_tech",
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    ssl: process.env.MYSQL_SSL === 'true'
  };
}

console.log("🔧 Configuration base de données:", {
  host: dbConfig.host,
  database: dbConfig.database,
  port: dbConfig.port,
  user: dbConfig.user
});

const pool = mysql.createPool(dbConfig);

// Test de la connexion amélioré
pool
  .getConnection()
  .then((conn) => {
    console.log("🔗 Tentative de connexion à la base de données...");
    return conn.query("SELECT DATABASE() as db_name, NOW() as server_time, VERSION() as version")
      .then((rows) => {
        console.log(`✅ Connecté à MySQL Aiven avec mysql2!`);
        console.log(`📊 Base de données: ${rows[0].db_name}`);
        console.log(`⏰ Heure du serveur: ${rows[0].server_time}`);
        console.log(`🔧 Version MySQL: ${rows[0].version}`);
        console.log(`🌐 Hôte: ${dbConfig.host}`);
        console.log(`🚀 Connexion Aiven réussie!`);
      })
      .finally(() => {
        conn.release();
      });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MySQL:", err.message);
    console.error("📌 Code erreur:", err.code);
    console.log("🔍 Configuration utilisée:", {
      host: dbConfig.host,
      database: dbConfig.database,
      port: dbConfig.port
    });
  });

module.exports = pool;