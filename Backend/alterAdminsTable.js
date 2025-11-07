// Importation des modules nécessaires
require('dotenv').config({ path: './.env' }); // Pour charger les variables d'environnement
const mariadb = require('mariadb');

// Configuration de la base de données
const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  port: process.env.DB_PORT || 3306,
});

async function alterAdminsTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connexion à la base de données réussie.');

    console.log("Modification de la table 'admins' pour s'assurer que la colonne 'password' est VARCHAR(255)...");
    // Cette commande est idempotente et ne causera pas d'erreur si la colonne est déjà du bon type.
    await conn.query("ALTER TABLE admins MODIFY password VARCHAR(255) NOT NULL");
    console.log('✅ Table 'admins' modifiée avec succès (ou était déjà à jour).');

  } catch (err) {
    console.error('❌ Erreur lors de la modification de la table admins:', err);
  } finally {
    if (conn) await conn.release();
    await pool.end();
    console.log('Connexion à la base de données fermée.');
  }
}

alterAdminsTable();
