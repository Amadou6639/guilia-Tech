
const mariadb = require("mariadb");

const createFunctionsTable = async () => {
  console.log("--- Début du script de création de la table 'functions' ---");

  const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "amadou",
    password: process.env.DB_PASSWORD || "66396816",
    database: process.env.DB_NAME || "guilla_tech",
    port: process.env.DB_PORT || 3306,
  };

  console.log(`🔧 Tentative de connexion à la base de données sur l'hôte '${dbConfig.host}' avec l'utilisateur '${dbConfig.user}'.`);

  let conn;
  try {
    conn = await mariadb.createConnection(dbConfig);
    console.log("✅ Connexion à la base de données réussie.");

    console.log("🔧 Création de la table 'functions'...");
    await conn.query(`
      CREATE TABLE IF NOT EXISTS functions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Table 'functions' créée avec succès ou existe déjà.");

  } catch (err) {
    console.error("❌ Une erreur est survenue pendant l'exécution du script:");
    console.error(`  - Code d'erreur: ${err.code}`);
    console.error(`  - Numéro d'erreur: ${err.errno}`);
    console.error(`  - Message: ${err.message}`);
  } finally {
    if (conn) {
      console.log("🔌 Fermeture de la connexion à la base de données.");
      await conn.end();
    }
    console.log("--- Fin du script ---");
  }
};

createFunctionsTable();
