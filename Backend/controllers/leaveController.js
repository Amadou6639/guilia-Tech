const pool = require("../config/database");

const formatMySqlDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

const leaveController = {
  // Récupérer toutes les demandes de congé
  getAllLeaves: async (req, res) => {
    let conn;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; // 10 congés par page
      const search = req.query.search || "";
      conn = await pool.getConnection();

      let whereClause = "";
      let queryParams = [];
      if (search.trim() !== "") {
        whereClause = " WHERE e.name LIKE ? ";
        queryParams.push(`%${search.trim()}%`);
      }

      // Obtenir le nombre total de congés
      const totalResult = await conn.query(
        `SELECT COUNT(*) as total FROM leaves l JOIN employees e ON l.employee_id = e.id ${whereClause}`,
        queryParams
      );
      const total = Number(totalResult[0].total);

      const offset = (page - 1) * limit;
      const paginatedParams = [...queryParams, limit, offset];

      const leaves = await conn.query(
        `
        SELECT l.*, e.name as employee_name
        FROM leaves l
        JOIN employees e ON l.employee_id = e.id
        ${whereClause}
        ORDER BY l.start_date DESC
        LIMIT ? OFFSET ?`,
        paginatedParams
      );
      res.status(200).json({
        leaves,
        total,
        page,
        pages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error("❌ Erreur GET /leaves:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    }
    finally {
      if (conn) conn.release();
    }
  },

  // Créer une nouvelle demande de congé
  createLeave: async (req, res) => {
    let conn;
    try {
      const { employee_id, start_date, end_date, reason } = req.body;
      if (!employee_id || !start_date || !end_date) {
        return res
          .status(400)
          .json({ error: "L'employé et les dates sont requis." });
      }
      conn = await pool.getConnection();
      const result = await conn.query(
        "INSERT INTO leaves (employee_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)",
        [employee_id, formatMySqlDate(start_date), formatMySqlDate(end_date), reason || ""]
      );
      res.status(201).json({
        message: "Demande de congé créée avec succès.",
        insertId: result.insertId,
      });
    } catch (err) {
      console.error("❌ Erreur POST /leaves:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    }
    finally {
      if (conn) conn.release();
    }
  },

  // Mettre à jour une demande de congé (par exemple, le statut)
  updateLeave: async (req, res) => {
    let conn;
    try {
      const { id } = req.params;
      const { start_date, end_date, reason, status } = req.body; // Garde les champs existants

      const fieldsToUpdate = {};
      if (start_date) fieldsToUpdate.start_date = formatMySqlDate(start_date);
      if (end_date) fieldsToUpdate.end_date = formatMySqlDate(end_date);
      if (reason !== undefined) fieldsToUpdate.reason = reason;
      if (status) fieldsToUpdate.status = status;

      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: "Aucun champ à mettre à jour." });
      }

      conn = await pool.getConnection();
      const setClause = Object.keys(fieldsToUpdate).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(fieldsToUpdate), id];
      const result = await conn.query(`UPDATE leaves SET ${setClause} WHERE id = ?`, values);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Demande de congé non trouvée." });
      }
      res
        .status(200)
        .json({ message: "Demande de congé mise à jour avec succès." });
    } catch (err) {
      console.error(`❌ Erreur PUT /leaves/${req.params.id}:`, err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    }
    finally {
      if (conn) conn.release();
    }
  },

  // Supprimer une demande de congé
  deleteLeave: async (req, res) => {
    let conn;
    try {
      const { id } = req.params;
      conn = await pool.getConnection();
      const result = await conn.query("DELETE FROM leaves WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Demande de congé non trouvée." });
      }
      res
        .status(200)
        .json({ message: "Demande de congé supprimée avec succès." });
    } catch (err) {
      console.error(`❌ Erreur DELETE /leaves/${req.params.id}:`, err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    }
    finally {
      if (conn) conn.release();
    }
  },

  // Récupérer les congés pour un employé spécifique
  getLeavesByEmployee: async (req, res) => {
    let conn;
    try {
      const { id } = req.params; // ID de l'employé
      conn = await pool.getConnection();
      const leaves = await conn.query(
        "SELECT * FROM leaves WHERE employee_id = ? ORDER BY start_date DESC",
        [id]
      );
      res.status(200).json(leaves);
    } catch (err) {
      console.error(`❌ Erreur GET /employees/${req.params.id}/leaves:`, err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    }
    finally {
      if (conn) conn.release();
    }
  },
};

module.exports = leaveController;
