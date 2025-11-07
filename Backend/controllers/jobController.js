const pool = require("../config/database");

const jobController = {
  // Récupérer toutes les fonctions avec le nombre d'employés
  getAllJobs: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const jobs = await conn.query(`
        SELECT j.id, j.title, j.description, COUNT(e.id) as employee_count
        FROM jobs j
        LEFT JOIN employees e ON j.title = e.position
        GROUP BY j.id, j.title, j.description
        ORDER BY j.title ASC
      `);
      res.status(200).json(jobs);
    } catch (err) {
      console.error("❌ Erreur GET /jobs:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },

  // Créer une nouvelle fonction
  createJob: async (req, res) => {
    let conn;
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Le titre est requis." });
      }
      conn = await pool.getConnection();
      const result = await conn.query(
        "INSERT INTO jobs (title, description) VALUES (?, ?)",
        [title, description || ""]
      );
      res
        .status(201)
        .json({
          message: "Fonction créée avec succès.",
          insertId: result.insertId,
        });
    } catch (err) {
      console.error("❌ Erreur POST /jobs:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },

  // Mettre à jour une fonction
  updateJob: async (req, res) => {
    let conn;
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Le titre est requis." });
      }
      conn = await pool.getConnection();
      const result = await conn.query(
        "UPDATE jobs SET title = ?, description = ? WHERE id = ?",
        [title, description || "", id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Fonction non trouvée." });
      }
      res.status(200).json({ message: "Fonction mise à jour avec succès." });
    } catch (err) {
      console.error(`❌ Erreur PUT /jobs/${req.params.id}:`, err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },

  // Supprimer une fonction
  deleteJob: async (req, res) => {
    let conn;
    try {
      const { id } = req.params;
      conn = await pool.getConnection();
      const result = await conn.query("DELETE FROM jobs WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Fonction non trouvée." });
      }
      res.status(200).json({ message: "Fonction supprimée avec succès." });
    } catch (err) {
      console.error(`❌ Erreur DELETE /jobs/${req.params.id}:`, err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },
};

module.exports = jobController;
