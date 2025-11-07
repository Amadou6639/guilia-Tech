
require('dotenv').config({ path: './.env' });
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  port: process.env.DB_PORT || 3306,
});

const adminEmailToPromote = 'admin@test.com';

async function promoteAdmin() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connexion à la base de données réussie.');

    console.log(`Mise à jour du rôle pour l'administrateur avec l'e-mail: ${adminEmailToPromote}...`);
    const result = await conn.query("UPDATE admins SET role = ? WHERE email = ?", ['super-admin', adminEmailToPromote]);

    if (result.affectedRows === 0) {
      console.log(`Aucun administrateur trouvé avec l'e-mail '${adminEmailToPromote}'. Aucune modification n'a été effectuée.`);
    } else {
      console.log(`✅ L'administrateur avec l'e-mail '${adminEmailToPromote}' a été promu au rôle de 'super-admin'.`);
    }

  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour de l'administrateur:", err);
  } finally {
    if (conn) await conn.release();
    await pool.end();
    console.log('Connexion à la base de données fermée.');
  }
}

promoteAdmin();
