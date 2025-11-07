module.exports = function (pool) {
  return {
    // Récupérer toutes les fonctions
    getAllFunctions: async (req, res) => {
      let conn;
      try {
        conn = await pool.getConnection();
        const functions = await conn.query(`
          SELECT 
            f.id, 
            f.name, 
            f.description, 
            COUNT(e.id) AS employee_count
          FROM functions f
          LEFT JOIN employees e ON e.function_id = f.id
          GROUP BY f.id, f.name, f.description
          ORDER BY f.name ASC
        `);
        res.json(functions);
      } catch (error) {
        console.error("Erreur lors de la récupération des fonctions:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des fonctions", error: error.message });
      } finally {
        if (conn) conn.release();
      }
    },

    // Créer une nouvelle fonction
    createFunction: async (req, res) => {
      const { name, title, description } = req.body; // Accepte 'name' ou 'title' pour la compatibilité
      if (!name && !title) {
        return res
          .status(400)
          .json({ error: "Le nom de la fonction est requis" });
      }
      let conn;
      try {
        conn = await pool.getConnection();
        const [result] = await conn.query(
          "INSERT INTO functions (name, description) VALUES (?, ?)",
          [name || title, description || null]
        );
        res.status(201).json({ id: result.insertId, title: name || title, description: description || null });
      } catch (error) {
        console.error("Erreur lors de la création de la fonction:", error);
        res.status(500).json({ error: "Erreur serveur" });
      }
    },

    // Mettre à jour une fonction
    updateFunction: async (req, res) => {
      const { id } = req.params;
      const { name, title, description } = req.body;
      if (!name && !title) {
        return res
          .status(400)
          .json({ error: "Le nom de la fonction est requis" });
      }
      let conn;
      try {
        conn = await pool.getConnection();
        const result = await conn.query(
          "UPDATE functions SET name = ?, description = ? WHERE id = ?",
          [name || title, description || null, id]
        );
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Fonction non trouvée." });
        }
        res.status(200).json({ message: "Fonction mise à jour avec succès." });
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la fonction:", error);
        res.status(500).json({ error: "Erreur serveur" });
      } finally {
        if (conn) conn.release();
      }
    },

    // Supprimer une fonction
    deleteFunction: async (req, res) => {
      const { id } = req.params;
      let conn;
      try {
        conn = await pool.getConnection();
        const result = await conn.query(
          "DELETE FROM functions WHERE id = ?",
          [id]
        );
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Fonction non trouvée." });
        }
        res.status(200).json({ message: "Fonction supprimée avec succès." });
      } catch (error) {
        console.error("Erreur lors de la suppression de la fonction:", error);
        res.status(500).json({ error: "Erreur serveur" });
      } finally {
        if (conn) conn.release();
      }
    },
  };
};
