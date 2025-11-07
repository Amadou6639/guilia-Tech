const express = require("express");
const crypto = require('crypto');

module.exports = function (pool) {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "L'adresse email est requise." });
    }

    let conn;
    try {
      conn = await pool.getConnection();

      // Vérifier si l'email existe déjà
      const existingSubscriber = await conn.query(
        "SELECT id FROM subscribers WHERE email = ?",
        [email]
      );

      if (existingSubscriber.length > 0) {
        return res
          .status(409)
          .json({ error: "Cette adresse email est déjà abonnée." });
      }

      // Générer un token de confirmation
      const token = crypto.randomBytes(20).toString('hex');

      // Insérer le nouvel abonné avec le token
      const result = await conn.query(
        "INSERT INTO subscribers (email, token) VALUES (?, ?)",
        [email, token]
      );

      res
        .status(201)
        .json({ message: "Abonnement réussi ! Un email de confirmation a été envoyé.", id: result.insertId });
    } catch (err) {
      console.error("❌ Erreur POST /api/subscribe:", err);
      res.status(500).json({ error: "Erreur serveur lors de l'abonnement." });
    } finally {
      if (conn) conn.release();
    }
  });

  return router;
};
