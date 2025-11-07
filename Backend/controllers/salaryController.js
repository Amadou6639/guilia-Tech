const pool = require("../config/database");

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  // Correction pour obtenir la date en UTC
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const salaryController = {
  // Récupérer tous les salaires
  getAllSalaries: async (req, res) => {
    let conn;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; // 10 salaires par page
      const search = req.query.search || "";
      conn = await pool.getConnection();

      let whereClause = "";
      let queryParams = [];
      if (search.trim() !== "") {
        whereClause = " WHERE e.name LIKE ? ";
        queryParams.push(`%${search.trim()}%`);
      }

      // Obtenir le nombre total de salaires
      const totalResult = await conn.query(
        `SELECT COUNT(*) as total FROM salaries s JOIN employees e ON s.employee_id = e.id ${whereClause}`,
        queryParams
      );
      const total = Number(totalResult[0].total);

      const offset = (page - 1) * limit;
      const paginatedParams = [...queryParams, limit, offset];

      const salaries = await conn.query(
        `
        SELECT s.*, e.name as employee_name, e.position
        FROM salaries s
        JOIN employees e ON s.employee_id = e.id
        ${whereClause}
        ORDER BY e.name ASC
        LIMIT ? OFFSET ?`,
        paginatedParams
      );
      res.status(200).json({
        salaries,
        total,
        page,
        pages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error("❌ Erreur GET /salaries:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },

  // Créer une nouvelle entrée de salaire
  createSalary: async (req, res) => {
    let conn;
    try {
      const { employee_id, amount, payment_status, last_payment_date } =
        req.body;
      if (!employee_id || !amount) {
        return res
          .status(400)
          .json({ error: "L'employé et le montant sont requis." });
      }

      const formattedDate = formatDate(last_payment_date);

      conn = await pool.getConnection();
      const result = await conn.query(
        "INSERT INTO salaries (employee_id, amount, payment_status, last_payment_date) VALUES (?, ?, ?, ?)",
        [
          employee_id,
          amount,
          payment_status || "En attente",
          formattedDate,
        ]
      );
      res.status(201).json({
        message: "Salaire ajouté avec succès.",
        insertId: result.insertId,
      });
    } catch (err) {
      console.error("❌ Erreur POST /salaries:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },

  // Mettre à jour un salaire
  updateSalary: async (req, res) => {
    let conn;
    try {
      const { id } = req.params;
      const { amount, payment_status, last_payment_date } = req.body;

      const formattedDate = formatDate(last_payment_date);

      conn = await pool.getConnection();
      const result = await conn.query(
        "UPDATE salaries SET amount = ?, payment_status = ?, last_payment_date = ? WHERE id = ?",
        [amount, payment_status, formattedDate, id]
      );
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Entrée de salaire non trouvée." });
      }
      res.status(200).json({ message: "Salaire mis à jour avec succès." });
    } catch (err) {
      console.error(`❌ Erreur PUT /salaries/${req.params.id}:`, err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },

  // Supprimer un salaire
  deleteSalary: async (req, res) => {
    let conn;
    try {
      const { id } = req.params;
      conn = await pool.getConnection();
      const result = await conn.query("DELETE FROM salaries WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Entrée de salaire non trouvée." });
      }
      res.status(200).json({ message: "Salaire supprimé avec succès." });
    } catch (err) {
      console.error(`❌ Erreur DELETE /salaries/${req.params.id}:`, err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },
};

module.exports = salaryController;
