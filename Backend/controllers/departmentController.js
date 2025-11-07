/**
 * Contrôleur pour la gestion des départements.
 * @param {object} pool - L'objet de connexion à la base de données MariaDB.
 * @returns {object} Un objet contenant les méthodes du contrôleur.
 */
module.exports = function (pool) {
  const { logAction } = require("../services/auditLogService");
  const fs = require("fs");
  const csv = require("fast-csv");

  return {
    /**
     * Récupère tous les départements avec le nombre de services associés.
     */
    getAllDepartments: async (req, res) => {
      let conn;
      try {
        conn = await pool.getConnection();
        const query = `

        SELECT d.*, 
                COUNT(DISTINCT s.id) as service_count,
                COUNT(DISTINCT e.id) as employee_count
         FROM departments d
         LEFT JOIN services s ON d.id = s.department_id
         LEFT JOIN employees e ON s.id = e.service_id
         GROUP BY d.id
         ORDER BY d.name ASC`;

        const rows = await conn.query(query);

        // Convertir BigInt en String pour la sérialisation JSON
        const departments = rows.map((dep) => ({
          ...dep,
          id: dep.id.toString(),
          service_count: Number(dep.service_count), // Assurer que le comptage est un nombre
          employee_count: Number(dep.employee_count),
        }));

        res.status(200).json(departments);
      } catch (error) {
        console.error("❌ Erreur GET /departments:", error);
        res.status(500).json({
          message: "Erreur lors de la récupération des départements.",
          error: error.message,
          sql: error.sql, // Inclure la requête SQL pour le débogage
        });
      } finally {
        if (conn) conn.release();
      }
    },

    // Créer un nouveau département
    createDepartment: async (req, res) => {
      let conn;
      try {
        const { name, description } = req.body;
        const image = req.file ? req.file.path : null;

        if (!name) {
          return res
            .status(400)
            .json({ error: "Le nom du département est requis." });
        }

        conn = await pool.getConnection();
        const result = await conn.query(
          "INSERT INTO departments (name, description, image) VALUES (?, ?, ?)",
          [name, description || null, image]
        );

        // Journal d'audit
        await logAction(
          req,
          "CREATE_DEPARTMENT",
          "department",
          result.insertId
        );

        res.status(201).json({
          message: "Département créé avec succès.",
          insertId: result.insertId,
        });
      } catch (err) {
        console.error("❌ Erreur POST /departments:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(409)
            .json({ error: "Un département avec ce nom existe déjà." });
        }
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },

    // Mettre à jour un département
    updateDepartment: async (req, res) => {
      console.log('--- UPDATE DEPARTMENT ---');
      let conn;
      try {
        const { id } = req.params;
        const { name, description } = req.body;
        console.log(`ID: ${id}, Name: ${name}, Description: ${description}`);

        if (!name) {
          return res
            .status(400)
            .json({ error: "Le nom du département est requis." });
        }

        conn = await pool.getConnection();

        const oldDataRows = await conn.query(
          "SELECT name, description, image FROM departments WHERE id = ?",
          [id]
        );

        if (oldDataRows.length === 0) {
          return res.status(404).json({ error: "Département non trouvé." });
        }

        const oldData = oldDataRows[0];
        console.log('Old data:', oldData);

        const updates = {};
        if (name) updates.name = name;
        if (description !== undefined) updates.description = description;

        if (req.file) {
          updates.image = req.file.path;
          if (oldData.image) {
            fs.unlink(oldData.image, (err) => {
              if (err) console.error("Erreur suppression ancienne image:", err);
            });
          }
        }
        console.log('Updates:', updates);

        const queryParts = [];
        const params = [];
        for (const [key, value] of Object.entries(updates)) {
          queryParts.push(`${key} = ?`);
          params.push(value);
        }

        if (queryParts.length === 0) {
          return res.status(200).json({ message: "Aucune modification fournie." });
        }

        params.push(id);
        const query = `UPDATE departments SET ${queryParts.join(", ")} WHERE id = ?`;
        console.log('Query:', query);
        console.log('Params:', params);

        const result = await conn.query(query, params);
        console.log('Query result:', result);

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Département non trouvé." });
        }

        const newDataForLog = { ...oldData, ...updates };
        await logAction(req, "UPDATE_DEPARTMENT", "department", id, {
          old: oldData,
          new: newDataForLog,
        });

        res.status(200).json({ message: "Département mis à jour avec succès." });

      } catch (err) {
        console.error(`❌ Erreur PUT /departments/${req.params.id}:`, err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Un département avec ce nom existe déjà.' });
        }
        res.status(500).json({
          message: "Erreur serveur lors de la mise à jour du département.",
          error: err.message,
          sql: err.sql,
          errno: err.errno,
        });
      } finally {
        if (conn) conn.release();
      }
    },

    // Supprimer un département
    deleteDepartment: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        conn = await pool.getConnection();

        const department = await conn.query(
          "SELECT image FROM departments WHERE id = ?",
          [id]
        );

        // Vérifier si le département est utilisé par des employés
        const [employees] = await conn.query(
          "SELECT COUNT(*) as count FROM employees WHERE department_id = ?",
          [id]
        );
        if (employees && employees[0].count > 0) {
          return res.status(400).json({
            error: `Impossible de supprimer, ce département est assigné à ${employees[0].count} employé(s).`,
          });
        }

        const result = await conn.query(
          "DELETE FROM departments WHERE id = ?",
          [id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Département non trouvé." });
        }

        // Supprimer l'image associée
        if (department && department.length > 0 && department[0].image) {
          fs.unlink(department[0].image, (err) => {
            if (err)
              console.error("Erreur lors de la suppression de l'image:", err);
          });
        }

        await logAction(req, "DELETE_DEPARTMENT", "department", id, null, {
          sendNotificationEmail: true,
        });

        res.status(200).json({ message: "Département supprimé avec succès." });
      } catch (err) {
        console.error(`❌ Erreur DELETE /departments/${req.params.id}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },

    /**
     * Récupère tous les services pour un département donné.
     */
    getServicesByDepartment: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        conn = await pool.getConnection();
        const services = await conn.query(
          "SELECT id, title, description, icon FROM services WHERE department_id = ? ORDER BY title ASC",
          [id]
        );
        res.status(200).json(services);
      } catch (error) {
        console.error(
          `❌ Erreur GET /departments/${req.params.id}/services:`,
          error
        );
        res.status(500).json({
          message:
            "Erreur lors de la récupération des services du département.",
          error: error.message,
        });
      } finally {
        if (conn) conn.release();
      }
    },

    /**
     * Récupère tous les employés pour un département donné.
     */
    getEmployeesByDepartment: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        conn = await pool.getConnection();
        const employees = await conn.query(
          "SELECT id, name, position, email FROM employees WHERE department_id = ? ORDER BY name ASC",
          [id]
        );
        res.status(200).json(employees);
      } catch (error) {
        console.error(
          `❌ Erreur GET /departments/${req.params.id}/employees:`,
          error
        );
        res.status(500).json({
          message:
            "Erreur lors de la récupération des employés du département.",
          error: error.message,
        });
      } finally {
        if (conn) conn.release();
      }
    },

    /**
     * Exporte la liste des employés d'un département en fichier CSV.
     */
    exportEmployeesToCsv: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        conn = await pool.getConnection();

        // Récupérer le nom du département pour le nom du fichier
        const [departmentInfo] = await conn.query(
          "SELECT name FROM departments WHERE id = ?",
          [id]
        );
        const departmentName =
          departmentInfo && departmentInfo.length > 0
            ? departmentInfo[0].name
            : "export";
        const fileName = `employes_${departmentName
          .replace(/\s+/g, "_")
          .toLowerCase()}_${new Date().toISOString().split("T")[0]}.csv`;

        // Récupérer les employés
        const employees = await conn.query(
          "SELECT name, position, email, phone FROM employees WHERE department_id = ? ORDER BY name ASC",
          [id]
        );

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileName}"`
        );

        const csvStream = csv.format({ headers: true });
        csvStream.pipe(res);

        if (employees.length > 0) {
          employees.forEach((employee) => {
            csvStream.write({
              Nom: employee.name,
              Poste: employee.position,
              Email: employee.email,
              Téléphone: employee.phone,
            });
          });
        }

        csvStream.end();
      } catch (error) {
        console.error(
          `❌ Erreur GET /departments/${req.params.id}/employees/export:`,
          error
        );
        res.status(500).json({ message: "Erreur lors de l'exportation CSV." });
      } finally {
        if (conn) conn.release();
      }
    },
  };
};
