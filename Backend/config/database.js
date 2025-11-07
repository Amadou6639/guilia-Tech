const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "amadou",
  password: process.env.DB_PASSWORD || "66396816",
  database: process.env.DB_NAME || "guilla_tech",
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
});

// Test de la connexion
pool
  .getConnection()
  .then((conn) => {
    conn.query("SELECT DATABASE() as db_name").then((rows) => {
      console.log(
        `✅ Connecté à la base de données MariaDB : ${rows[0].db_name}`
      );
    });
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MariaDB:", err.message);
    console.error("❌ Code erreur:", err.code);
  });

module.exports = pool;
