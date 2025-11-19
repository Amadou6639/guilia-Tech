const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Fonction pour signer le token (gardée locale ou déplacée dans un utilitaire)
const signToken = (payload, secret) => {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

module.exports = function (pool, JWT_SECRET, { verifyToken, authorizeRoles }) {
  // Middleware pour protéger les routes nécessitant un admin
  const adminAuth = [verifyToken, authorizeRoles(["admin"])];

  // POST /api/auth/register-admin
  // La protection par 'protect' ici signifie que seul un admin connecté peut enregistrer un NOUVEL admin
  router.post("/register-admin", adminAuth, async (req, res) => {
    const { name, email, password } = req.body;
    let client;
    try {
      client = await pool.connect();

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Nom, email et mot de passe sont requis." });
      }

      // 1. Vérifier si l'admin existe déjà
      const existing = await client.query(
        "SELECT id FROM admins WHERE email = $1",
        [email]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "Cet email est déjà utilisé." });
      }

      // 2. Hacher le mot de passe et insérer
      const hash = await bcrypt.hash(password, 10); // Utilisez un salt plus sûr, par ex. 10
      const result = await client.query(
        "INSERT INTO admins (name, email, password, role) VALUES ($1, $2, $3, 'admin') RETURNING id", // Ajout d'un rôle par défaut
        [name, email, hash]
      );

      const newAdminId = result.rows[0].id;
      const token = signToken(
        { id: newAdminId, email: email, name: name },
        JWT_SECRET
      );

      res.status(201).json({
        message: "Admin créé avec succès",
        token,
        admin: { id: newAdminId, name, email },
      });
    } catch (err) {
      console.error("❌ Erreur lors de l'inscription:", err);
      res
        .status(500)
        .json({ error: "Une erreur est survenue lors de l'inscription." });
    } finally {
      if (client) client.release();
    }
  });

  // POST /api/auth/login-admin
  router.post("/login-admin", async (req, res) => {
    const { email, password } = req.body;
    let client;
    try {
      console.log("Login attempt with email:", email); // DEBUG
      if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis" });
      }

      client = await pool.connect();
      const result = await client.query("SELECT * FROM admins WHERE email = $1", [
        email,
      ]);

      // 1) Vérifier si l'admin existe
      if (result.rows.length === 0) {
        console.log("Admin not found for email:", email); // DEBUG
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      const admin = result.rows[0];
      console.log("Admin found:", admin); // DEBUG

      // 2) Vérifier si l'admin existe VRAIMENT avant de lire son mot de passe
      if (!admin) {
        console.log(
          "Admin object is null or undefined after query for email:",
          email
        ); // DEBUG
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      // 3) Vérifier le mot de passe (le champ dans la DB doit être 'password')
      console.log("Comparing password for user:", email); // DEBUG
      const match = await bcrypt.compare(password, admin.password);
      console.log("Password match result:", match); // DEBUG

      if (!match) {
        console.log("Password does not match for user:", email); // DEBUG
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      // 3) Connexion réussie, générer et envoyer le token
      console.log("Login successful for user:", email); // DEBUG
      const token = signToken(
        {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role, // Inclus le rôle dans le token
        },
        JWT_SECRET
      );

      // ✅ Répétition des champs que le FRONTEND attend (name, email, id, role)
      res.status(200).json({
        message: "Connexion réussie",
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role, // Assurez-vous d'envoyer le rôle au frontend
        },
      });
    } catch (err) {
      console.error("❌ Erreur lors de la connexion:", err);
      res
        .status(500)
        .json({ error: "Une erreur est survenue sur le serveur." });
    } finally {
      if (client) client.release();
    }
  });

  return router;
};
