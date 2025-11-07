// Importation des modules nécessaires
require('dotenv').config({ path: './.env' }); // Pour charger les variables d'environnement
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');

// --- CONFIGURATION ---
// L'email de l'admin dont le mot de passe doit être réinitialisé
const ADMIN_EMAIL_TO_RESET = 'admin@test.com';
const NEW_ADMIN_PASSWORD = 'admin123'; // Le nouveau mot de passe
// ------------------

// Configuration de la base de données
const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  port: process.env.DB_PORT || 3306,
});

async function resetPassword() {
  let conn;
  try {
    // Hacher le nouveau mot de passe
    console.log('Hachage du nouveau mot de passe...');
    const hashedPassword = await bcrypt.hash(NEW_ADMIN_PASSWORD, 10);
    console.log('Nouveau mot de passe haché.');

    // Obtenir une connexion à partir du pool
    conn = await pool.getConnection();
    console.log('Connexion à la base de données réussie.');

    // Mettre à jour le mot de passe de l'administrateur
    console.log(`Réinitialisation du mot de passe pour l\'administrateur '${ADMIN_EMAIL_TO_RESET}'...`);
    const result = await conn.query(
      "UPDATE admins SET password = ? WHERE email = ?",
      [hashedPassword, ADMIN_EMAIL_TO_RESET]
    );

    if (result.affectedRows === 0) {
      console.log(`❌ Aucun administrateur trouvé avec l'email '${ADMIN_EMAIL_TO_RESET}'. Aucune modification n'a été effectuée.`);
    } else {
      console.log('✅ Mot de passe administrateur réinitialisé avec succès !');
      console.log(`   Email: ${ADMIN_EMAIL_TO_RESET}`);
      console.log(`   Nouveau mot de passe: ${NEW_ADMIN_PASSWORD}`);
    }

  } catch (err) {
    console.error('❌ Erreur lors de la réinitialisation du mot de passe de l\'administrateur:', err);
  } finally {
    // Libérer la connexion et fermer le pool
    if (conn) {
        await conn.release();
        console.log('Connexion libérée.');
    }
    await pool.end();
    console.log('Pool de connexions fermé.');
  }
}

// Lancer la fonction
resetPassword();
