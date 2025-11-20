const createTrainingController = (pool) => ({ // Renommé pour correspondre à l'import dans la route
  // Uses pg Pool interface (pool.connect / client.query)
  getAllTrainings: async (req, res) => {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query("SELECT * FROM trainings ORDER BY created_at DESC");
      const trainings = result.rows || [];

      const safeTrainings = trainings.map(t => ({
        ...t,
        title: t.title || '',
        description: t.description || ''
      }));

      res.status(200).json(safeTrainings);
    } catch (err) {
      console.error('❌ Erreur GET /trainings:', err);
      res.status(500).json({ error: 'Erreur serveur: ' + err.message });
    } finally {
      if (client) client.release();
    }
  },

  createTraining: async (req, res) => {
    let client;
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: 'Le titre et la description sont requis.' });
      }

      client = await pool.connect();
      const result = await client.query(
        "INSERT INTO trainings (title, description) VALUES ($1, $2) RETURNING id",
        [title, description]
      );

      const newId = result.rows && result.rows[0] ? result.rows[0].id : null;
      res.status(201).json({ id: newId, title, description });
    } catch (err) {
      console.error('❌ Erreur POST /trainings:', err);
      res.status(500).json({ error: 'Erreur serveur: ' + err.message });
    } finally {
      if (client) client.release();
    }
  },

  deleteTraining: async (req, res) => {
    let client;
    try {
      const { id } = req.params;
      client = await pool.connect();
      const result = await client.query("DELETE FROM trainings WHERE id = $1", [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Formation non trouvée.' });
      }

      res.status(200).json({ message: 'Formation supprimée avec succès.' });
    } catch (err) {
      console.error('❌ Erreur DELETE /trainings/:id:', err);
      res.status(500).json({ error: 'Erreur serveur: ' + err.message });
    } finally {
      if (client) client.release();
    }
  },
});

module.exports = createTrainingController; // Exportation de la fonction d'usine elle-même
