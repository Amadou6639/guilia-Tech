/**
 * Fichier: employeeController.js
 * Description: Gère la logique métier pour les employés (CRUD, photo, etc.).
 * Auteur: [Votre Nom]
 * Contrôleur pour la gestion des employés
 */
module.exports = function (pool) {
  const getAllEmployees = async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      // Jointure avec la table departments pour récupérer le nom du département
      const employees = await conn.query(`
        SELECT e.*, s.title as department_name, f.name as function_title 
        FROM employees e
        LEFT JOIN services s ON e.service_id = s.id
        LEFT JOIN functions f ON e.function_id = f.id
        ORDER BY e.name ASC
      `);

      res.json({ employees });
    } catch (error) {
      console.error("Erreur récupération employés:", error);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (conn) conn.release();
    }
  };

  const createEmployee = async (req, res) => {
    let conn;
    try {
      console.log("📥 Données reçues pour création employé:", req.body);
      console.log("📁 Fichier reçu:", req.file);

      let employeeData = { ...req.body };

      // --- GESTION DE LA COMPATIBILITÉ ---
      // Si le frontend envoie first_name/last_name, on les combine en 'name'
      if (
        employeeData.first_name &&
        employeeData.last_name &&
        !employeeData.name
      ) {
        employeeData.name =
          `${employeeData.first_name} ${employeeData.last_name}`.trim();
      }

      // Si un fichier photo est uploadé, ajouter le chemin
      // NOTE: La colonne 'photo' n'existe pas dans le schéma actuel, donc cette partie est désactivée.
      /* 
      if (req.file) {
        employeeData.photo = `/uploads/${req.file.filename}`;
      }
      */

      if (employeeData.department_id) {
        employeeData.service_id = parseInt(employeeData.department_id, 10);
        delete employeeData.department_id;
      }

      const {
        name,
        position,
        email,
        service_id, // On utilise service_id
        function_id, // Add function_id
      } = employeeData;

      // Validation des champs requis
      if (!name || !position || !email) {
        return res.status(400).json({
          error: "Champs requis manquants: name, position, email",
          received_data: employeeData,
        });
      }

      conn = await pool.getConnection();
      const result = await conn.query(
        "INSERT INTO employees (name, position, email, service_id, function_id) VALUES (?, ?, ?, ?, ?)",
        [name, position, email, service_id || null, function_id || null] // Add function_id
      );

      const newEmployee = { id: result.insertId, ...employeeData };

      res.status(201).json({
        message: "Employé créé avec succès",
        employee: newEmployee,
      });
    } catch (error) {
      console.error("❌ Erreur création employé:", error);
      res.status(500).json({
        error: "Erreur lors de la création de l'employé: " + error.message,
      });
    } finally {
      if (conn) conn.release();
    }
  };

  const updateEmployee = async (req, res) => {
    let conn;
    try {
      const { id } = req.params;
      let updateData = { ...req.body };

      console.log("=== DEBUG UPDATE EMPLOYEE ===");
      console.log("📝 ID:", id);
      console.log("📦 Données reçues:", JSON.stringify(updateData, null, 2));
      console.log("📋 Headers:", req.headers["content-type"]);

      // Validation de l'ID
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "ID invalide" });
      }

      // Compatibilité: combine first_name et last_name si présents
      if (updateData.first_name && updateData.last_name) {
        updateData.name =
          `${updateData.first_name} ${updateData.last_name}`.trim();
        delete updateData.first_name;
        delete updateData.last_name;
      }

      // Supprimer les champs qui ne sont pas dans la table
      const allowedFields = [
        "name",
        "position",
        "email",
        "service_id",
        "phone",
        "address",
        "function_id", // Add function_id
      ];

      if (updateData.department_id) {
        updateData.service_id = parseInt(updateData.department_id, 10);
        delete updateData.department_id;
      }

      // Renommer department_id en service_id pour la compatibilité avec l'ancienne structure si besoin
      // mais la cible est bien department_id
      Object.keys(updateData).forEach((key) => {
        if (!allowedFields.includes(key)) {
          delete updateData[key];
        }
      });
      console.log(
        "🔄 Données après nettoyage:",
        JSON.stringify(updateData, null, 2)
      );

      // Vérifier s'il reste des champs valides à mettre à jour
      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ error: "Aucune donnée valide à mettre à jour" });
      }

      conn = await pool.getConnection();
      console.log("✅ Connexion DB acquise");

      // Construction de la requête UPDATE
      const setClause = Object.keys(updateData)
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = [...Object.values(updateData), parseInt(id)];

      const query = `UPDATE employees SET ${setClause} WHERE id = ?`;
      console.log("📋 Requête SQL:", query);
      console.log("🎯 Valeurs:", values);

      const result = await conn.query(query, values);
      console.log(
        "✅ Requête exécutée - Lignes affectées:",
        result.affectedRows
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Employé non trouvé." });
      }

      // Récupérer l'employé mis à jour pour le retour
      console.log("🔄 Récupération des données mises à jour...");
      const [updatedEmployee] = await conn.query(
        "SELECT e.*, s.title as department_name, f.name as function_title FROM employees e LEFT JOIN services s ON e.service_id = s.id LEFT JOIN functions f ON e.function_id = f.id WHERE e.id = ?",
        [id]
      );

      console.log("✅ Employé mis à jour:", updatedEmployee);
      console.log("=== FIN DEBUG UPDATE ===");

      res.json({
        message: `Employé ${id} mis à jour avec succès`,
        employee: updatedEmployee,
      });
    } catch (error) {
      console.error("❌ ERREUR COMPLÈTE updateEmployee:");
      console.error("📍 Message:", error.message);
      console.error("📍 Stack:", error.stack);
      console.error("📍 Code:", error.code);
      console.error("📍 Numéro erreur:", error.errno);

      res.status(500).json({
        error: "Erreur lors de la mise à jour",
        details: error.message,
        code: error.code,
      });
    } finally {
      if (conn) {
        console.log("🔓 Libération connexion DB");
        conn.release();
      }
    }
  };
  const deleteEmployee = async (req, res) => {
    let conn;
    try {
      const { id } = req.params;
      conn = await pool.getConnection();

      console.log(`🗑️ Suppression employé ${id}`);

      const result = await conn.query("DELETE FROM employees WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Employé non trouvé." });
      }

      res.json({
        message: `Employé ${id} supprimé avec succès`,
      });
    } catch (error) {
      console.error("❌ Erreur suppression employé:", error);
      res.status(500).json({ error: "Erreur lors de la suppression" });
    } finally {
      if (conn) conn.release();
    }
  };

  const getUnassignedEmployees = async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const employees = await conn.query(
        "SELECT id, name, position FROM employees WHERE service_id IS NULL ORDER BY name ASC"
      );
      res.json(employees);
    } catch (error) {
      console.error("Erreur récupération employés non assignés:", error);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (conn) conn.release();
    }
  };

  const getEmployeeById = async (req, res) => {
    let conn;
    try {
      const { id } = req.params;
      conn = await pool.getConnection();
      const [employee] = await conn.query(
        `
        SELECT e.*, s.title as department_name 
        FROM employees e
        LEFT JOIN services s ON e.service_id = s.id
        WHERE e.id = ?
      `,
        [id]
      );

      if (!employee || employee.length === 0) {
        return res.status(404).json({ error: "Employé non trouvé." });
      }

      res.json(employee[0]);
    } catch (error) {
      console.error(`❌ Erreur récupération employé ${req.params.id}:`, error);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (conn) conn.release();
    }
  };

  const updateEmployeePhoto = async (req, res) => {
    const { id } = req.params;
    let conn;

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier image fourni." });
    }

    try {
      conn = await pool.getConnection();

      // 1. Récupérer l'ancien chemin de la photo pour la supprimer plus tard
      const [currentEmployee] = await conn.query(
        "SELECT photo FROM employees WHERE id = ?",
        [id]
      );

      if (!currentEmployee) {
        return res.status(404).json({ error: "Employé non trouvé." });
      }
      const oldPhotoPath = currentEmployee.photo;

      // 2. Traiter et sauvegarder la nouvelle image (similaire à partners.js)
      const sharp = require("sharp");
      const fs = require("fs");
      const path = require("path");

      const originalPath = req.file.path;
      const newFilename = `employee-${id}-${Date.now()}.webp`;
      const newPath = path.join("uploads", newFilename);

      await sharp(originalPath)
        .resize({ width: 200, height: 200, fit: "cover" })
        .webp({ quality: 80 })
        .toFile(newPath);

      fs.unlinkSync(originalPath); // Supprimer le fichier original uploadé par multer

      const newPhotoUrl = `/uploads/${newFilename}`;

      // 3. Mettre à jour la base de données
      await conn.query("UPDATE employees SET photo = ? WHERE id = ?", [
        newPhotoUrl,
        id,
      ]);

      // 4. Supprimer l'ancienne photo du serveur si elle existe
      if (
        oldPhotoPath &&
        fs.existsSync(path.join(__dirname, "..", oldPhotoPath))
      ) {
        fs.unlinkSync(path.join(__dirname, "..", oldPhotoPath));
      }

      res
        .status(200)
        .json({
          message: "Photo mise à jour avec succès.",
          photoUrl: newPhotoUrl,
        });
    } catch (error) {
      console.error(`❌ Erreur PUT /employees/${id}/photo:`, error);
      res
        .status(500)
        .json({ error: "Erreur serveur lors de la mise à jour de la photo." });
    } finally {
      if (conn) conn.release();
    }
  };

  return {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getUnassignedEmployees,
    getEmployeeById,
    updateEmployeePhoto,
  };
};
