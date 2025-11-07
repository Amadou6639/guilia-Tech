const fs = require("fs");
const path = require("path");

module.exports = function (pool) {
  return {
    // Récupérer tous les documents d'un employé
    getDocumentsForEmployee: async (req, res) => {
      const { id } = req.params;
      let conn;
      try {
        conn = await pool.getConnection();
        const documents = await conn.query(
          "SELECT * FROM employee_documents WHERE employee_id = ? ORDER BY upload_date DESC",
          [id]
        );
        res.status(200).json(documents);
      } catch (error) {
        console.error(`❌ Erreur GET /employees/${id}/documents:`, error);
        res.status(500).json({ error: "Erreur serveur." });
      } finally {
        if (conn) conn.release();
      }
    },

    // Uploader un nouveau document
    uploadDocument: async (req, res) => {
      const { id } = req.params;
      const { file_type } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier fourni." });
      }
      if (!file_type) {
        return res
          .status(400)
          .json({ error: "Le type de document est requis." });
      }

      let conn;
      try {
        conn = await pool.getConnection();
        const { originalname, path: filePath } = req.file;
        const newPath = `/uploads/documents/${req.file.filename}`;

        const result = await conn.query(
          "INSERT INTO employee_documents (employee_id, file_name, file_path, file_type) VALUES (?, ?, ?, ?)",
          [id, originalname, newPath, file_type]
        );

        res
          .status(201)
          .json({
            message: "Document uploadé avec succès.",
            insertId: result.insertId,
          });
      } catch (error) {
        console.error(`❌ Erreur POST /employees/${id}/documents:`, error);
        res.status(500).json({ error: "Erreur serveur lors de l'upload." });
      } finally {
        if (conn) conn.release();
      }
    },

    // Supprimer un document
    deleteDocument: async (req, res) => {
      const { documentId } = req.params;
      let conn;
      try {
        conn = await pool.getConnection();

        // 1. Récupérer le chemin du fichier
        const [doc] = await conn.query(
          "SELECT file_path FROM employee_documents WHERE id = ?",
          [documentId]
        );
        if (!doc) {
          return res.status(404).json({ error: "Document non trouvé." });
        }

        // 2. Supprimer le fichier du serveur
        const filePath = path.join(__dirname, "..", doc.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // 3. Supprimer l'entrée de la base de données
        const result = await conn.query(
          "DELETE FROM employee_documents WHERE id = ?",
          [documentId]
        );
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Document non trouvé." });
        }

        res.status(200).json({ message: "Document supprimé avec succès." });
      } catch (error) {
        console.error(`❌ Erreur DELETE /documents/${documentId}:`, error);
        res
          .status(500)
          .json({ error: "Erreur serveur lors de la suppression." });
      } finally {
        if (conn) conn.release();
      }
    },
  };
};
