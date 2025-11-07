/**
 * Fichier: auditLogService.js
 * Description: Service pour la journalisation des actions des administrateurs.
 */

const pool = require("../config/database");

/**
 * Enregistre une action d'audit dans la base de données.
 * @param {object} req - L'objet de la requête Express, pour récupérer l'ID de l'admin.
 * @param {string} actionType - Le type d'action (ex: 'CREATE_DEPARTMENT', 'DELETE_EMPLOYEE').
 * @param {string} targetType - Le type de l'entité cible (ex: 'department', 'employee').
 * @param {number} targetId - L'ID de l'entité cible.
 * @param {object} details - Un objet JSON contenant des détails sur l'action (ex: anciennes et nouvelles valeurs).
 */
const logAction = async (req, actionType, targetType, targetId, details = null) => {
  let conn;
  try {
    const adminId = req.admin ? req.admin.id : null; // Récupère l'ID de l'admin depuis le middleware `protect`

    if (!adminId) {
      console.warn("⚠️ Tentative de journalisation sans adminId authentifié.");
      return;
    }

    const query =
      "INSERT INTO audit_logs (admin_id, action_type, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)";
    const values = [adminId, actionType, targetType, targetId, details ? JSON.stringify(details) : null];

    conn = await pool.getConnection();
    await conn.query(query, values);
  } catch (error) {
    console.error("❌ Erreur lors de la journalisation de l'action d'audit:", error);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { logAction };