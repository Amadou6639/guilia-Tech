const express = require("express");
// Importation du middleware d'authentification sous forme de fonction d'usine
const authMiddlewareFactory = require("../middleware/authMiddleware"); 

/**
 * Initialise et retourne le routeur Express pour la gestion des demandes de contact.
 * @param {object} pool - L'objet de connexion à la base de données MariaDB.
 * @returns {object} Le routeur Express configuré.
 */
module.exports = function (pool) {
  const router = express.Router();
  
  // Récupération de la clé secrète pour le middleware
  const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_par_defaut_tres_long_et_securise";
  
  // Appel de la fonction d'usine pour récupérer les middlewares 'protect' et 'authorize'
  const { protect } = authMiddlewareFactory(pool, JWT_SECRET);


  // Récupérer toutes les demandes
  // @route   GET /api/requests
  // @access  Private (Admin)
  router.get("/", protect, async (req, res) => {
    let client;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      const searchTerm = req.query.search || "";

      let whereClause = "";
      let queryParams = [];
      let paramIndex = 1;

      if (searchTerm && searchTerm.trim() !== "") {
        whereClause = ` WHERE nom ILIKE $${paramIndex++} OR email ILIKE $${paramIndex++} OR besoin ILIKE $${paramIndex++} `;
        const searchTermLike = `%${searchTerm}%`;
        queryParams.push(searchTermLike, searchTermLike, searchTermLike);
      }

      client = await pool.connect();

      // Récupérer le nombre total de demandes
      const totalResult = await client.query(
        `SELECT COUNT(*) as count FROM requests${whereClause}`,
        queryParams
      );

      const total = Number(totalResult.rows[0].count);

      // Récupérer les demandes paginées
      const paginatedQuery = `
        SELECT * FROM requests 
        ${whereClause} 
        ORDER BY date_creation DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;

      const paginatedParams = [...queryParams, limit, offset];
      const requestsResult = await client.query(paginatedQuery, paginatedParams);

      res.json({
        requests: requestsResult.rows,
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      });
    } catch (err) {
      console.error("❌ Erreur GET /requests:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (client) client.release();
    }
  });

  // Recevoir une nouvelle demande
  // @route   POST /api/requests
  // @access  Public
  router.post("/", async (req, res) => {
    let client;
    try {
      const { nom, email, tel, besoin } = req.body;

      if (!nom || !email || !tel || !besoin) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }

      client = await pool.connect();
      const result = await client.query(
        "INSERT INTO requests (nom, email, tel, besoin) VALUES ($1, $2, $3, $4) RETURNING id",
        [nom, email, tel, besoin]
      );

      res.status(201).json({
        message: "Demande enregistrée",
        id: result.rows[0].id,
      });
    } catch (err) {
      console.error("❌ Erreur POST /requests:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (client) client.release();
    }
  });

  // Modifier une demande
  // @route   PUT /api/requests/:id
  // @access  Private (Admin)
  router.put("/:id", protect, async (req, res) => {
    let client;
    try {
      const { nom, email, tel, besoin } = req.body;
      const requestId = req.params.id;

      if (!nom || !email || !tel || !besoin) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }

      client = await pool.connect();
      const result = await client.query(
        "UPDATE requests SET nom = $1, email = $2, tel = $3, besoin = $4 WHERE id = $5",
        [nom, email, tel, besoin, requestId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      res.json({ message: "Demande modifiée avec succès" });
    } catch (err) {
      console.error("❌ Erreur PUT /requests:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (client) client.release();
    }
  });

  // Valider une demande
  // @route   PUT /api/requests/:id/validate
  // @access  Private (Admin)
  router.put("/:id/validate", protect, async (req, res) => {
    let client;
    try {
      const requestId = req.params.id;

      client = await pool.connect();
      // ✅ CORRECTION: Une seule requête SQL
      const result = await client.query(
        "UPDATE requests SET status = 'traité' WHERE id = $1",
        [requestId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      res.json({ message: "Demande validée avec succès" });
    } catch (err) {
      console.error("❌ Erreur validation demande:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (client) client.release();
    }
  });

  // Supprimer une demande
  // @route   DELETE /api/requests/:id
  // @access  Private (Admin)
  router.delete("/:id", protect, async (req, res) => {
    let client;
    try {
      const requestId = req.params.id;

      client = await pool.connect();
      const result = await client.query("DELETE FROM requests WHERE id = $1", [
        requestId,
      ]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      res.json({ message: "Demande supprimée avec succès" });
    } catch (err) {
      console.error("❌ Erreur DELETE /requests:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (client) client.release();
    }
  });

  return router;
};
