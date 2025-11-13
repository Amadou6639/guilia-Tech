const { Parser } = require("json2csv");

const { PrismaClient } = require("../generate/prisma");
const prisma = new PrismaClient();

const auditLogController = {
  getLogs: async (req, res) => {
    let conn;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 15; // 15 logs par page
      const offset = (page - 1) * limit;
      const { adminId, startDate, endDate } = req.query;

      const whereCondition = {};

      if (adminId) {
        whereCondition.admin_id = Number(adminId);
      }
      if (startDate) {
        whereCondition.created_at = { gte: new Date(startDate) };
      }
      if (endDate) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        whereCondition.created_at = {
          ...(whereCondition.created_at || {}),
          lt: nextDay,
        };
      }

      // const whereCondition =
      // whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

      const logs = await prisma.audit_logs.findMany({
        where: whereCondition,
        orderBy: { created_at: "desc" },
        skip: offset,
        take: limit,
      });

      const totalResult = await prisma.audit_logs.count({
        where: whereCondition,
      });

      res.status(200).json({
        logs,
        totalPages: Math.ceil(totalResult / limit),
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
    try {
      const logs = await prisma.audit_logs.findMany({
        select: {
          id: true,
          admin_id: true,
          admin_name: true,
          action: true,
          target_type: true,
          target_id: true,
          details: true,
          created_at: true,
        },
        orderBy: { created_at: "desc" },
      });

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
      res.status(500).json({
        error: "Erreur serveur lors de l'exportation: " + err.message,
      });
    }
  },

  getAdminsForFilter: async (req, res) => {
    let conn;
    try {
      const admins = await prisma.admins.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      res.status(200).json(admins);
    } catch (err) {
      console.error("❌ Erreur GET /audit-logs/admins:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    }
  },
};

module.exports = auditLogController;
