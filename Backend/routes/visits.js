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
    let client;
    try {
      const { page, user_agent, referrer } = req.body;

      if (!page) {
        return res.status(400).json({ error: "La page est requise" });
      }

      client = await pool.connect();
      await client.query(
        "INSERT INTO visits (page, user_agent, referrer) VALUES ($1, $2, $3)",
        [page, user_agent || null, referrer || null]
      );

      res.status(201).json({ message: "Visite enregistrée" });
    } catch (err) {
      console.error("❌ Erreur POST /visits:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (client) client.release();
    }
  });

  // Récupérer les statistiques de visites (protégé)
  router.get("/stats", protect, async (req, res) => {
    let client;
    try {
      const { period = "week" } = req.query; // day, week, month

      client = await pool.connect();

      // Déterminer l'intervalle de temps
      let interval;
      switch (period) {
        case "day":
          interval = "1 day";
          break;
        case "week":
          interval = "7 days";
          break;
        case "month":
          interval = "1 month";
          break;
        default:
          interval = "7 days";
      }

      // Nombre total de visites pour la période
      const totalResult = await client.query(
        `SELECT COUNT(*) as total FROM visits WHERE created_at >= NOW() - $1::interval`,
        [interval]
      );
      const totalVisits = Number(totalResult.rows[0].total);

      // Visites par page pour la période
      const pagesResult = await client.query(
        `SELECT page, COUNT(*) as count FROM visits WHERE created_at >= NOW() - $1::interval GROUP BY page ORDER BY count DESC`,
        [interval]
      );

      const visitsByPage = pagesResult.rows.map((item) => ({
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
      if (client) client.release();
    }
  });

  // Récupérer toutes les visites (pour l'admin)
  router.get("/", protect, async (req, res) => {
    let client;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      client = await pool.connect();

      // Total des visites
      const totalResult = await client.query(
        "SELECT COUNT(*) as total FROM visits"
      );
      const total = Number(totalResult.rows[0].total);

      // Visites paginées
      const visitsResult = await client.query(
        "SELECT * FROM visits ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        [limit, offset]
      );

      res.json({
        visits: visitsResult.rows,
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      });
    } catch (err) {
      console.error("❌ Erreur GET /visits:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (client) client.release();
    }
  });

  return router;
};
