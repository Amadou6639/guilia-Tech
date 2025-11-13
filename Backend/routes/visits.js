module.exports = function (pool) {
  const express = require("express");
  // ⚠️ CORRECTION : Importation du middleware sous forme de fonction d'usine
  const authMiddlewareFactory = require("../middleware/authMiddleware");
  const router = express.Router();

  // Récupération de la clé secrète pour le middleware
  const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_par_defaut_tres_long_et_securise";
  
  // Appel de la fonction d'usine pour récupérer les middlewares 'protect' et 'authorize'
  const { protect } = authMiddlewareFactory(pool, JWT_SECRET);


  // Enregistrer une visite de page
  router.post("/", async (req, res) => {
    let conn;
    try {
      const { page, user_agent, referrer } = req.body;

      if (!page) {
        return res.status(400).json({ error: "La page est requise" });
      }

      conn = await pool.getConnection();
      await conn.query(
        "INSERT INTO visits (page, user_agent, referrer) VALUES (?, ?, ?)",
        [page, user_agent || null, referrer || null]
      );

      res.status(201).json({ message: "Visite enregistrée" });
    } catch (err) {
      console.error("❌ Erreur POST /visits:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (conn) conn.release();
    }
  });

  // Récupérer les statistiques de visites (protégé)
  router.get("/stats", protect, async (req, res) => {
    let conn;
    try {
      const { period = "week" } = req.query; // day, week, month

      conn = await pool.getConnection();

      // Déterminer l'intervalle de temps
      let interval;
      switch (period) {
        case "day":
          interval = "1 DAY";
          break;
        case "week":
          interval = "7 DAY";
          break;
        case "month":
          interval = "30 DAY";
          break;
        default:
          interval = "7 DAY";
      }

      // Nombre total de visites pour la période
      // Ajout de la déstructuration pour garantir l'extraction du résultat
      const [totalResult] = await conn.query(
        `SELECT COUNT(*) as total FROM visits WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${interval})`
      );
      const totalVisits = Number(totalResult.total);

      // Visites par page pour la période
      const pagesResult = await conn.query(
        `SELECT page, COUNT(*) as count FROM visits WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${interval}) GROUP BY page ORDER BY count DESC`
      );

      const visitsByPage = pagesResult.map((item) => ({
        ...item,
        count: Number(item.count),
      }));

      res.json({
        totalVisits,
        visitsByPage: visitsByPage,
        period,
      });
    } catch (err) {
      console.error("❌ Erreur GET /visits/stats:", err.message, err.stack);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  });

  // Récupérer toutes les visites (pour l'admin)
  router.get("/", protect, async (req, res) => {
    let conn;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      conn = await pool.getConnection();

      // Total des visites
      const [totalResult] = await conn.query(
        "SELECT COUNT(*) as total FROM visits"
      );
      const total = Number(totalResult.total);

      // Visites paginées
      const visits = await conn.query(
        "SELECT * FROM visits ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [limit, offset]
      );

      res.json({
        visits,
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      });
    } catch (err) {
      console.error("❌ Erreur GET /visits:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (conn) conn.release();
    }
  });

  return router;
};
