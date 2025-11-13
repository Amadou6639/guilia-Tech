// Importation des modules nécessaires
require('dotenv').config({ path: './.env' }); // Pour charger les variables d'environnement
const { PrismaClient } = require('./generated/prisma');
const bcrypt = require('bcryptjs');

// --- Récupération des arguments de la ligne de commande ---
const args = process.argv.slice(2);
const NEW_ADMIN_EMAIL = args[0];
const NEW_ADMIN_PASSWORD = args[1];
const NEW_ADMIN_NAME = args[2] || 'Admin User'; // Nom optionnel

// --- Validation des arguments ---
if (!NEW_ADMIN_EMAIL || !NEW_ADMIN_PASSWORD) {
  console.log('Usage: node createAdmin.js <email> <mot_de_passe> [nom]');
  console.log('Exemple: node createAdmin.js newadmin@example.com mysecretpassword "John Doe"');
  process.exit(1); // Quitter si les arguments sont manquants
}
// ------------------------------------

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hacher le mot de passe
    console.log('Hachage du mot de passe...');
    const hashedPassword = await bcrypt.hash(NEW_ADMIN_PASSWORD, 10);
    console.log('Mot de passe haché.');

    // Vérifier si l'administrateur existe déjà
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: NEW_ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log(`⚠️ L'administrateur avec l'email '${NEW_ADMIN_EMAIL}' existe déjà.`);
      return; // Arrêter le script si l'admin existe
    }

    // Insérer le nouvel administrateur
    console.log(`Création de l'administrateur '${NEW_ADMIN_NAME}'...`);
    const newAdmin = await prisma.admin.create({
      data: {
        name: NEW_ADMIN_NAME,
        email: NEW_ADMIN_EMAIL,
        password: hashedPassword,
        role: 'SUPER_ADMIN', // Vous pouvez ajuster le rôle ici
      },
    });

    console.log('✅ Administrateur créé avec succès !');
    console.log(`   ID: ${newAdmin.id}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Mot de passe: ${NEW_ADMIN_PASSWORD}`);

  } catch (err) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', err);
  } finally {
    // Se déconnecter de Prisma
    await prisma.$disconnect();
    console.log('Déconnexion de la base de données.');
  }
}

// Lancer la fonction
createAdmin();