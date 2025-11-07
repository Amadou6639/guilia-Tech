const { logAction } = require("../services/auditLogService");

module.exports = function (pool) {
  return {
    /**
     * Récupère tous les services avec les informations du département et du responsable.
     */
    getAllServices: async (req, res) => {
      let conn;
      try {
        conn = await pool.getConnection();
        const query = `
          SELECT 
            s.id, s.title, s.description, s.icon, s.responsable_id, s.department_id,
            d.name as department_name,
            e.name as responsable_name,
            (SELECT COUNT(*) FROM employees WHERE service_id = s.id) as employee_count
          FROM services s
          LEFT JOIN departments d ON s.department_id = d.id
          LEFT JOIN employees e ON s.responsable_id = e.id
          ORDER BY s.title ASC
        `;
        const rows = await conn.query(query);
        res.status(200).json({ services: rows });
      } catch (error) {
        console.error("❌ Erreur GET /services:", error);
        res.status(500).json({
          message: "Erreur lors de la récupération des services.",
          error: error.message,
        });
      } finally {
        if (conn) conn.release();
      }
    },

    /**
     * Récupère un service par son ID avec les informations du département et du responsable.
     */
    getServiceById: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        conn = await pool.getConnection();
        const query = `
          SELECT 
            s.id, s.title, s.description, s.icon, s.responsable_id, s.department_id,
            d.name as department_name,
            e.name as responsable_name
          FROM services s
          LEFT JOIN departments d ON s.department_id = d.id
          LEFT JOIN employees e ON s.responsable_id = e.id
          WHERE s.id = ?
        `;
        const [rows] = await conn.query(query, [id]);

        if (rows.length === 0) {
          return res.status(404).json({ message: "Service non trouvé." });
        }

        res.status(200).json({ service: rows[0] });
      } catch (error) {
        console.error(`❌ Erreur GET /services/${req.params.id}:`, error);
        res.status(500).json({
          message: "Erreur lors de la récupération du service.",
          error: error.message,
        });
      } finally {
        if (conn) conn.release();
      }
    },

    /**
     * Récupère des services similaires basés sur le department_id.
     */
    getSimilarServices: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        const { limit = 3 } = req.query; // Default limit to 3

        conn = await pool.getConnection();

        // First, get the department_id of the current service
        const [currentService] = await conn.query(
          "SELECT department_id FROM services WHERE id = ?",
          [id]
        );

        if (!Array.isArray(currentService) || currentService.length === 0 || !currentService[0] || !currentService[0].department_id) {
          return res.status(200).json({ services: [] }); // No similar services if no department or service not found
        }

        const departmentId = currentService[0].department_id;

        // Then, get other services from the same department, excluding the current service
        const query = `
          SELECT 
            s.id, s.title, s.description, s.icon, s.responsable_id, s.department_id,
            d.name as department_name,
            e.name as responsable_name
          FROM services s
          LEFT JOIN departments d ON s.department_id = d.id
          LEFT JOIN employees e ON s.responsable_id = e.id
          WHERE s.department_id = ? AND s.id != ?
          ORDER BY RAND()
          LIMIT ?
        `;
        const similarServices = await conn.query(query, [departmentId, id, parseInt(limit)]);

        res.status(200).json({ services: similarServices });
      } catch (error) {
        console.error(`❌ Erreur GET /services/${req.params.id}/similar:`, error);
        res.status(500).json({
          message: "Erreur lors de la récupération des services similaires.",
          error: error.message,
        });
      } finally {
        if (conn) conn.release();
      }
    },

    /**
     * Crée un nouveau service.
     */
    createService: async (req, res) => {
      let conn;
      try {
        const { title, description, icon, responsable_id, department_id } =
          req.body;

        if (!title) {
          return res
            .status(400)
            .json({ error: "Le titre du service est requis." });
        }

        conn = await pool.getConnection();
        const result = await conn.query(
          "INSERT INTO services (title, description, icon, responsable_id, department_id) VALUES (?, ?, ?, ?, ?)",
          [
            title,
            description || null,
            icon || null,
            responsable_id || null,
            department_id || null,
          ]
        );

        await logAction(req, "CREATE_SERVICE", "service", result.insertId);

        res.status(201).json({
          message: "Service créé avec succès.",
          insertId: result.insertId,
        });
      } catch (err) {
        console.error("❌ Erreur POST /services:", err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },

    /**
     * Met à jour un service existant.
     */
    updateService: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        const { title, description, icon, responsable_id, department_id } =
          req.body;

        if (!title) {
          return res
            .status(400)
            .json({ error: "Le titre du service est requis." });
        }

        conn = await pool.getConnection();

        const oldDataResult = await conn.query(
          "SELECT * FROM services WHERE id = ?",
          [id]
        );

        const result = await conn.query(
          "UPDATE services SET title = ?, description = ?, icon = ?, responsable_id = ?, department_id = ? WHERE id = ?",
          [
            title,
            description || null,
            icon || null,
            responsable_id || null,
            department_id || null,
            id,
          ]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Service non trouvé." });
        }

        const newData = {
          title,
          description,
          icon,
          responsable_id,
          department_id,
        };
        await logAction(req, "UPDATE_SERVICE", "service", id, {
          old: oldDataResult[0],
          new: newData,
        });

        res.status(200).json({ message: "Service mis à jour avec succès." });
      } catch (err) {
        console.error(`❌ Erreur PUT /services/${req.params.id}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },

    /**
     * Supprime un service.
     */
    deleteService: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        conn = await pool.getConnection();

        // Vérifier si le service est utilisé par des employés
        const [employees] = await conn.query(
          "SELECT COUNT(*) as count FROM employees WHERE service_id = ?",
          [id]
        );
        if (employees && employees[0].count > 0) {
          return res.status(400).json({
            error: `Impossible de supprimer, ce service est assigné à ${employees[0].count} employé(s).`,
          });
        }

        const result = await conn.query("DELETE FROM services WHERE id = ?", [
          id,
        ]);

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Service non trouvé." });
        }

        await logAction(req, "DELETE_SERVICE", "service", id);

        res.status(200).json({ message: "Service supprimé avec succès." });
      } catch (err) {
        console.error(`❌ Erreur DELETE /services/${req.params.id}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },
  };
};
