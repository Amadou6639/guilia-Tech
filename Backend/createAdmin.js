// Importation des modules nécessaires
require('dotenv').config({ path: './.env' }); // Pour charger les variables d'environnement
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');

// --- CONFIGURATION ---
// Modifiez ces valeurs pour votre administrateur
const NEW_ADMIN_EMAIL = 'admin@test.com';
const NEW_ADMIN_PASSWORD = 'password123';
const NEW_ADMIN_NAME = 'Admin User';
// -------------------

// Configuration de la base de données (identique à votre fichier database.js)
const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'amadou',
  password: process.env.DB_PASSWORD || '66396816',
  database: process.env.DB_NAME || 'guilla_tech',
  port: process.env.DB_PORT || 3306,
});

async function createAdmin() {
  let conn;
  try {
    // Hacher le mot de passe
    console.log('Hachage du mot de passe...');
    const hashedPassword = await bcrypt.hash(NEW_ADMIN_PASSWORD, 10);
    console.log('Mot de passe haché.');

    // Obtenir une connexion à partir du pool
    conn = await pool.getConnection();
    console.log('Connexion à la base de données réussie.');

    // Vérifier si l'administrateur existe déjà
    const existingAdmins = await conn.query("SELECT id FROM admins WHERE email = ?", [NEW_ADMIN_EMAIL]);
    if (existingAdmins.length > 0) {
      console.log(`⚠️ L'administrateur avec l'email '${NEW_ADMIN_EMAIL}' existe déjà.`);
      return; // Arrêter le script si l'admin existe
    }

    // Insérer le nouvel administrateur
    console.log(`Création de l'administrateur '${NEW_ADMIN_NAME}'...`);
    const result = await conn.query(
      "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
      [NEW_ADMIN_NAME, NEW_ADMIN_EMAIL, hashedPassword]
    );

    console.log('✅ Administrateur créé avec succès !');
    console.log(`   ID: ${result.insertId}`);
    console.log(`   Email: ${NEW_ADMIN_EMAIL}`);
    console.log(`   Mot de passe: ${NEW_ADMIN_PASSWORD}`);

  } catch (err) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', err);
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
createAdmin();
