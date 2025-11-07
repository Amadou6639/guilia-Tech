
require('dotenv').config({ path: './.env' });
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  port: process.env.DB_PORT || 3306,
});

async function listAdmins() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connexion à la base de données réussie.');

    console.log("Liste des administrateurs et de leurs rôles :");
    const admins = await conn.query("SELECT id, name, email, role FROM admins");

    if (admins.length === 0) {
      console.log("Aucun administrateur trouvé dans la table 'admins'.");
    } else {
      console.table(admins);
    }

  } catch (err) {
    console.error("❌ Erreur lors de la récupération des administrateurs:", err);
  } finally {
    if (conn) await conn.release();
    await pool.end();
    console.log('Connexion à la base de données fermée.');
  }
}

listAdmins();
