const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

module.exports = function () {
  return {
    getAllEmployees: async (req, res) => {
      try {
        const employees = await prisma.employee.findMany({
          include: {
            service: {
              select: {
                title: true,
              },
            },
            employeeFunction: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        });

        const formattedEmployees = employees.map((e) => ({
          ...e,
          department_name: e.service?.title,
          function_title: e.employeeFunction?.name,
        }));

        res.json({ employees: formattedEmployees });
      } catch (error) {
        console.error("Erreur récupération employés:", error);
        res.status(500).json({ error: "Erreur serveur" });
      }
    },

    createEmployee: async (req, res) => {
      try {
        console.log("📥 Données reçues pour création employé:", req.body);
        let employeeData = { ...req.body };

        if (
          employeeData.first_name &&
          employeeData.last_name &&
          !employeeData.name
        ) {
          employeeData.name =
            `${employeeData.first_name} ${employeeData.last_name}`.trim();
        }

        const { name, position, email, service_id, function_id } = employeeData;

        if (!name || !position || !email) {
          return res.status(400).json({
            error: "Champs requis manquants: name, position, email",
            received_data: employeeData,
          });
        }

        const newEmployee = await prisma.employee.create({
          data: {
            name,
            position,
            email,
            service_id: service_id ? parseInt(service_id) : null,
            function_id: function_id ? parseInt(function_id) : null,
          },
        });

        res.status(201).json({
          message: "Employé créé avec succès",
          employee: newEmployee,
        });
      } catch (error) {
        console.error("❌ Erreur création employé:", error);
        res.status(500).json({
          error: "Erreur lors de la création de l'employé: " + error.message,
        });
      }
    },

    updateEmployee: async (req, res) => {
      try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (updateData.first_name && updateData.last_name) {
          updateData.name =
            `${updateData.first_name} ${updateData.last_name}`.trim();
          delete updateData.first_name;
          delete updateData.last_name;
        }

        const allowedFields = [
          "name",
          "position",
          "email",
          "service_id",
          "phone",
          "address",
          "function_id",
        ];

        Object.keys(updateData).forEach((key) => {
          if (!allowedFields.includes(key)) {
            delete updateData[key];
          }
        });

        if (Object.keys(updateData).length === 0) {
          return res
            .status(400)
            .json({ error: "Aucune donnée valide à mettre à jour" });
        }

        if (updateData.service_id) {
          updateData.service_id = parseInt(updateData.service_id);
          const service = await prisma.service.findUnique({
            where: { id: updateData.service_id },
          });
          if (service && service.department_id) {
            updateData.department_id = service.department_id;
          }
        }
        if (updateData.function_id)
          updateData.function_id = parseInt(updateData.function_id);

        const updatedEmployee = await prisma.employee.update({
          where: { id: parseInt(id) },
          data: updateData,
          include: {
            service: {
              include: {
                department: true,
              },
            },
            employeeFunction: { select: { name: true } },
          },
        });

        const formattedEmployee = {
          ...updatedEmployee,
          department_name: updatedEmployee.service?.department?.name,
          service_name: updatedEmployee.service?.title,
          function_title: updatedEmployee.employeeFunction?.name,
        };

        res.json({
          message: `Employé ${id} mis à jour avec succès`,
          employee: formattedEmployee,
        });
      } catch (error) {
        console.error("❌ ERREUR COMPLÈTE updateEmployee:", error);
        if (error.code === "P2025") {
          return res.status(404).json({ error: "Employé non trouvé." });
        }
        res.status(500).json({
          error: "Erreur lors de la mise à jour",
          details: error.message,
        });
      }
    },

    deleteEmployee: async (req, res) => {
      try {
        const { id } = req.params;
        await prisma.employee.delete({
          where: { id: parseInt(id) },
        });
        res.json({
          message: `Employé ${id} supprimé avec succès`,
        });
      } catch (error) {
        console.error("❌ Erreur suppression employé:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Employé non trouvé." });
        }
        res.status(500).json({ error: "Erreur lors de la suppression" });
      }
    },

    getUnassignedEmployees: async (req, res) => {
      try {
        const employees = await prisma.employee.findMany({
          where: { service_id: null },
          select: {
            id: true,
            name: true,
            position: true,
          },
          orderBy: { name: "asc" },
        });
        res.json(employees);
      } catch (error) {
        console.error("Erreur récupération employés non assignés:", error);
        res.status(500).json({ error: "Erreur serveur" });
      }
    },

    getEmployeeById: async (req, res) => {
      try {
        const { id } = req.params;
        const employee = await prisma.employee.findUnique({
          where: { id: parseInt(id) },
          include: {
            service: { select: { title: true } },
          },
        });

        if (!employee) {
          return res.status(404).json({ error: "Employé non trouvé." });
        }
        
        const formattedEmployee = {
            ...employee,
            department_name: employee.service?.title,
        };

        res.json(formattedEmployee);
      } catch (error) {
        console.error(`❌ Erreur récupération employé ${req.params.id}:`, error);
        res.status(500).json({ error: "Erreur serveur" });
      }
    },

    updateEmployeePhoto: async (req, res) => {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier image fourni." });
      }

      try {
        const currentEmployee = await prisma.employee.findUnique({
          where: { id: parseInt(id) },
          select: { photo_url: true },
        });

        if (!currentEmployee) {
          return res.status(404).json({ error: "Employé non trouvé." });
        }
        const oldPhotoPath = currentEmployee.photo_url;

        const originalPath = req.file.path;
        const newFilename = `employee-${id}-${Date.now()}.webp`;
        const newPath = path.join("uploads", newFilename);

        await sharp(originalPath)
          .resize({ width: 200, height: 200, fit: "cover" })
          .webp({ quality: 80 })
          .toFile(newPath);

        fs.unlinkSync(originalPath);

        const newPhotoUrl = `/uploads/${newFilename}`;

        await prisma.employee.update({
          where: { id: parseInt(id) },
          data: { photo_url: newPhotoUrl },
        });

        if (oldPhotoPath && fs.existsSync(path.join(__dirname, "..", oldPhotoPath))) {
          fs.unlinkSync(path.join(__dirname, "..", oldPhotoPath));
        }

        res.status(200).json({
          message: "Photo mise à jour avec succès.",
          photoUrl: newPhotoUrl,
        });
      } catch (error) {
        console.error(`❌ Erreur PUT /employees/${id}/photo:`, error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour de la photo." });
      }
    },
  };
};
