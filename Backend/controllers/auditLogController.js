const pool = require("../config/database");
const { Parser } = require("json2csv");

const auditLogController = {
  getLogs: async (req, res) => {
    let conn;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 15; // 15 logs par page
      const offset = (page - 1) * limit;
      const { adminId, startDate, endDate } = req.query;

      const whereClauses = [];
      const queryParams = [];

      if (adminId) {
        whereClauses.push("admin_id = ?");
        queryParams.push(adminId);
      }
      if (startDate) {
        whereClauses.push("created_at >= ?");
        queryParams.push(startDate);
      }
      if (endDate) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        whereClauses.push("created_at < ?");
        queryParams.push(nextDay.toISOString().split("T")[0]);
      }

      const whereCondition =
        whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

      conn = await pool.getConnection();

      const logsQuery = `SELECT * FROM audit_logs ${whereCondition} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      const logs = await conn.query(logsQuery, [...queryParams, limit, offset]);

      const countQuery = `SELECT COUNT(*) as total FROM audit_logs ${whereCondition}`;
      const [totalResult] = await conn.query(countQuery, queryParams);
      const totalLogs = totalResult.total;

      res.status(200).json({
        logs,
        totalPages: Math.ceil(totalLogs / limit),
        currentPage: page,
      });
    } catch (err) {
      console.error("❌ Erreur GET /audit-logs:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },

  exportLogs: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const logs = await conn.query(
        "SELECT id, admin_id, admin_name, action, target_type, target_id, details, created_at FROM audit_logs ORDER BY created_at DESC"
      );

      const fields = [
        { label: "ID", value: "id" },
        { label: "Date", value: "created_at" },
        { label: "ID Admin", value: "admin_id" },
        { label: "Nom Admin", value: "admin_name" },
        { label: "Action", value: "action" },
        { label: "Type Cible", value: "target_type" },
        { label: "ID Cible", value: "target_id" },
        { label: "Détails", value: "details" },
      ];

      const json2csvParser = new Parser({ fields, withBOM: true });
      const csv = json2csvParser.parse(logs);

      res.header("Content-Type", "text/csv; charset=utf-8");
      res.attachment("journal-audit.csv");
      res.send(csv);
    } catch (err) {
      console.error("❌ Erreur GET /audit-logs/export:", err);
      res
        .status(500)
        .json({
          error: "Erreur serveur lors de l'exportation: " + err.message,
        });
    } finally {
      if (conn) conn.release();
    }
  },

  getAdminsForFilter: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const admins = await conn.query(
        "SELECT id, name FROM admins ORDER BY name ASC"
      );
      res.status(200).json(admins);
    } catch (err) {
      console.error("❌ Erreur GET /audit-logs/admins:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },
};

module.exports = auditLogController;
