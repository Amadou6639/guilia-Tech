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
    let conn;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      const searchTerm = req.query.search || "";

      let whereClause = "";
      let queryParams = [];

      if (searchTerm && searchTerm.trim() !== "") {
        whereClause = " WHERE nom LIKE ? OR email LIKE ? OR besoin LIKE ? ";
        queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
      }

      conn = await pool.getConnection();

      // Récupérer le nombre total de demandes
      // Assurez-vous que l'index [0] est toujours utilisé pour les requêtes COUNT avec mariadb/promise
      const totalRows = await conn.query(
        `SELECT COUNT(*) as count FROM requests${whereClause}`,
        queryParams
      );

      // ✅ CORRECTION : Conversion BigInt → Number
      const total = Number(totalRows[0].count);

      // Récupérer les demandes paginées
      const paginatedQuery = `
        SELECT * FROM requests 
        ${whereClause} 
        ORDER BY date_creation DESC 
        LIMIT ? OFFSET ?
      `;

      const paginatedParams = [...queryParams, limit, offset];
      const requests = await conn.query(paginatedQuery, paginatedParams);

      res.json({
        requests,
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      });
    } catch (err) {
      console.error("❌ Erreur GET /requests:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  });

  // Recevoir une nouvelle demande
  // @route   POST /api/requests
  // @access  Public
  router.post("/", async (req, res) => {
    let conn;
    try {
      const { nom, email, tel, besoin } = req.body;

      if (!nom || !email || !tel || !besoin) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }

      conn = await pool.getConnection();
      const result = await conn.query(
        "INSERT INTO requests (nom, email, tel, besoin) VALUES (?, ?, ?, ?)",
        [nom, email, tel, besoin]
      );

      res.status(201).json({
        message: "Demande enregistrée",
        id: result.insertId,
      });
    } catch (err) {
      console.error("❌ Erreur POST /requests:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  });

  // Modifier une demande
  // @route   PUT /api/requests/:id
  // @access  Private (Admin)
  router.put("/:id", protect, async (req, res) => {
    let conn;
    try {
      const { nom, email, tel, besoin } = req.body;
      const requestId = req.params.id;

      if (!nom || !email || !tel || !besoin) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }

      conn = await pool.getConnection();
      const result = await conn.query(
        "UPDATE requests SET nom = ?, email = ?, tel = ?, besoin = ? WHERE id = ?",
        [nom, email, tel, besoin, requestId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      res.json({ message: "Demande modifiée avec succès" });
    } catch (err) {
      console.error("❌ Erreur PUT /requests:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (conn) conn.release();
    }
  });

  // Valider une demande
  // @route   PUT /api/requests/:id/validate
  // @access  Private (Admin)
  router.put("/:id/validate", protect, async (req, res) => {
    let conn;
    try {
      const requestId = req.params.id;

      conn = await pool.getConnection();
      // ✅ CORRECTION: Une seule requête SQL
      const result = await conn.query(
        "UPDATE requests SET status = 'traité' WHERE id = ?",
        [requestId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      res.json({ message: "Demande validée avec succès" });
    } catch (err) {
      console.error("❌ Erreur validation demande:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (conn) conn.release();
    }
  });

  // Supprimer une demande
  // @route   DELETE /api/requests/:id
  // @access  Private (Admin)
  router.delete("/:id", protect, async (req, res) => {
    let conn;
    try {
      const requestId = req.params.id;

      conn = await pool.getConnection();
      const result = await conn.query("DELETE FROM requests WHERE id = ?", [
        requestId,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      res.json({ message: "Demande supprimée avec succès" });
    } catch (err) {
      console.error("❌ Erreur DELETE /requests:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (conn) conn.release();
    }
  });

  return router;
};
