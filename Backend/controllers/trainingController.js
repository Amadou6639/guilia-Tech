const createTrainingController = (pool) => ({ // Renommé pour correspondre à l'import dans la route
  getAllTrainings: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      
      const trainings = await conn.query("SELECT * FROM trainings ORDER BY created_at DESC");
      
      // Mappage pour garantir que les champs textuels critiques ne sont jamais NULL
      const safeTrainings = trainings.map(training => ({
        ...training,
        // ✅ CORRECTION SÉCURITÉ DES DONNÉES : Remplacement de NULL par une chaîne vide pour tous les champs critiques
        title: training.title || '',
        description: training.description || '', 
      }));

      res.status(200).json(safeTrainings);
    } catch (err) {
      console.error('❌ Erreur GET /trainings:', err);
      res.status(500).json({ error: 'Erreur serveur: ' + err.message });
    } finally {
      if (conn) conn.release();
    }
  },

  createTraining: async (req, res) => {
    let conn;
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: 'Le titre et la description sont requis.' });
      }

      conn = await pool.getConnection();
      const result = await conn.query(
        "INSERT INTO trainings (title, description) VALUES (?, ?)",
        [title, description]
      );

      res.status(201).json({ id: result.insertId, title, description });
    } catch (err) {
      console.error('❌ Erreur POST /trainings:', err);
      res.status(500).json({ error: 'Erreur serveur: ' + err.message });
    } finally {
      if (conn) conn.release();
    }
  },

  deleteTraining: async (req, res) => {
    let conn;
    try {
      const { id } = req.params;
      conn = await pool.getConnection();
      const result = await conn.query("DELETE FROM trainings WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Formation non trouvée.' });
      }

      res.status(200).json({ message: 'Formation supprimée avec succès.' });
    } catch (err) {
      console.error('❌ Erreur DELETE /trainings/:id:', err);
      res.status(500).json({ error: 'Erreur serveur: ' + err.message });
    } finally {
      if (conn) conn.release();
    }
  },
});

module.exports = createTrainingController; // Exportation de la fonction d'usine elle-même
