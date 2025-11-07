
require('dotenv').config({ path: './.env' });
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  port: process.env.DB_PORT || 3306,
});

async function addRoleToAdminsTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connexion à la base de données réussie.');

    console.log("Vérification de l'existence de la colonne 'role' dans la table 'admins'...");
    const columns = await conn.query("SHOW COLUMNS FROM admins LIKE 'role'");

    if (columns.length === 0) {
      console.log("La colonne 'role' n'existe pas. Ajout de la colonne...");
      await conn.query("ALTER TABLE admins ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT 'admin'");
      console.log("✅ Colonne 'role' ajoutée avec succès à la table 'admins'.");
    } else {
      console.log("ℹ️ La colonne 'role' existe déjà dans la table 'admins'.");
    }

  } catch (err) {
    console.error("❌ Erreur lors de la modification de la table 'admins':", err);
  } finally {
    if (conn) await conn.release();
    await pool.end();
    console.log('Connexion à la base de données fermée.');
  }
}

addRoleToAdminsTable();
