const express = require("express");
const crypto = require('crypto');

module.exports = function (pool) {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "L'adresse email est requise." });
    }

    let client;
    try {
      client = await pool.connect();

      // Vérifier si l'email existe déjà
      const existingSubscriber = await client.query(
        "SELECT id FROM subscribers WHERE email = $1",
        [email]
      );

      if (existingSubscriber.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "Cette adresse email est déjà abonnée." });
      }

      // Générer un token de confirmation
      const token = crypto.randomBytes(20).toString('hex');

      // Insérer le nouvel abonné avec le token
      const result = await client.query(
        "INSERT INTO subscribers (email, token) VALUES ($1, $2) RETURNING id",
        [email, token]
      );

      res
        .status(201)
        .json({ message: "Abonnement réussi ! Un email de confirmation a été envoyé.", id: result.rows[0].id });
    } catch (err) {
      console.error("❌ Erreur POST /api/subscribe:", err);
      res.status(500).json({ error: "Erreur serveur lors de l'abonnement." });
    } finally {
      if (client) client.release();
    }
  });

  return router;
};
