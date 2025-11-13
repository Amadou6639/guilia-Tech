const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Générer token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  });
};

module.exports = function () {
  return {
    // Login admin
    login: async (req, res) => {
      try {
        const { email, password } = req.body;

        // 1) Vérifier si email et password existent
        if (!email || !password) {
          return res.status(400).json({ error: "Email et mot de passe requis" });
        }

        // 2) Vérifier si l'admin existe avec Prisma
        const admin = await prisma.admin.findUnique({ where: { email } });

        // 3) Si l'admin n'existe pas OU si le mot de passe est incorrect
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
          return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // 4) Si tout est ok, envoyer le token au client
        const token = signToken(admin.id);

        res.status(200).json({
          message: "Connexion réussie",
          token,
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
          },
        });
      } catch (error) {
        console.error("❌ Erreur lors de la connexion:", error);
        res.status(500).json({ error: "Une erreur est survenue sur le serveur." });
      }
    },

    // Register admin
    register: async (req, res) => {
      try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          return res.status(400).json({ error: "Nom, email et mot de passe sont requis." });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        const newAdmin = await prisma.admin.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });

        // Créer un token pour le nouvel admin
        const token = signToken(newAdmin.id);

        res.status(201).json({
          message: "Admin créé avec succès",
          token,
          admin: {
            id: newAdmin.id,
            name: newAdmin.name,
            email: newAdmin.email,
          },
        });
      } catch (error) {
        console.error("❌ Erreur lors de l'inscription:", error);
        
        // Vérifier si c'est une erreur d'unicité de l'email (code P2002 pour Prisma)
        if (error.code === 'P2002') {
          return res.status(409).json({ error: "Cet email est déjà utilisé." });
        }
        res.status(500).json({ error: "Une erreur est survenue lors de l'inscription." });
      }
    },
  };
};