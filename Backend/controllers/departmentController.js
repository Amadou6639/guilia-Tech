const { logAction } = require("../services/auditLogService");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const fs = require("fs");
const csv = require("fast-csv");

module.exports = function () {
  return {
    /**
     * Récupère tous les départements avec le nombre de services et d'employés associés.
     */
    getAllDepartments: async (req, res) => {
      try {
        const departments = await prisma.department.findMany({
          include: {
            _count: {
              select: { services: true },
            },
          },
          orderBy: {
            name: "asc",
          },
        });

        // Pour chaque département, comptez les employés dans les services associés
        for (const department of departments) {
          const services = await prisma.service.findMany({
            where: { department_id: department.id },
            select: { id: true },
          });
          const serviceIds = services.map(s => s.id);
          const employeeCount = await prisma.employee.count({
            where: { service_id: { in: serviceIds } },
          });
          department.employee_count = employeeCount;
          department.service_count = department._count.services;
        }


        res.status(200).json(departments);
      } catch (error) {
        console.error("❌ Erreur GET /departments:", error);
        res.status(500).json({
          message: "Erreur lors de la récupération des départements.",
          error: error.message,
        });
      }
    },

    // Créer un nouveau département
    createDepartment: async (req, res) => {
      try {
        const { name, description } = req.body;
        const image = req.file ? req.file.path : null;

        if (!name) {
          return res
            .status(400)
            .json({ error: "Le nom du département est requis." });
        }

        const newDepartment = await prisma.department.create({
          data: {
            name,
            description: description || null,
            image: image,
          },
        });

        await logAction(
          req,
          "CREATE_DEPARTMENT",
          "department",
          newDepartment.id
        );

        res.status(201).json({
          message: "Département créé avec succès.",
          department: newDepartment,
        });
      } catch (err) {
        console.error("❌ Erreur POST /departments:", err);
        if (err.code === "P2002") {
          return res
            .status(409)
            .json({ error: "Un département avec ce nom existe déjà." });
        }
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      }
    },

    // Mettre à jour un département
    updateDepartment: async (req, res) => {
      try {
        const { id } = req.params;
        const { name, description } = req.body;

        const oldDepartment = await prisma.department.findUnique({
          where: { id: parseInt(id) },
        });

        if (!oldDepartment) {
          return res.status(404).json({ error: "Département non trouvé." });
        }

        const dataToUpdate = {};
        if (name) dataToUpdate.name = name;
        if (description !== undefined) dataToUpdate.description = description;

        if (req.file) {
          dataToUpdate.image = req.file.path;
          if (oldDepartment.image) {
            fs.unlink(oldDepartment.image, (err) => {
              if (err) console.error("Erreur suppression ancienne image:", err);
            });
          }
        }

        const updatedDepartment = await prisma.department.update({
          where: { id: parseInt(id) },
          data: dataToUpdate,
        });

        await logAction(req, "UPDATE_DEPARTMENT", "department", parseInt(id), {
          old: oldDepartment,
          new: updatedDepartment,
        });

        res.status(200).json({ message: "Département mis à jour avec succès.", department: updatedDepartment });

      } catch (err) {
        console.error(`❌ Erreur PUT /departments/${req.params.id}:`, err);
        if (err.code === 'P2002') {
          return res.status(409).json({ error: 'Un département avec ce nom existe déjà.' });
        }
        res.status(500).json({
          message: "Erreur serveur lors de la mise à jour du département.",
          error: err.message,
        });
      }
    },

    // Supprimer un département
    deleteDepartment: async (req, res) => {
        try {
            const { id } = req.params;
    
            // 1. Trouver les services liés au département
            const services = await prisma.service.findMany({
                where: { department_id: parseInt(id) },
                select: { id: true }
            });
            const serviceIds = services.map(s => s.id);
    
            // 2. Vérifier si des employés sont liés à ces services
            if (serviceIds.length > 0) {
                const employeeCount = await prisma.employee.count({
                    where: { service_id: { in: serviceIds } }
                });
    
                if (employeeCount > 0) {
                    return res.status(400).json({
                        error: `Impossible de supprimer, ce département est indirectement assigné à ${employeeCount} employé(s) via ses services.`,
                    });
                }
            }
    
            // 3. Récupérer les informations du département pour la suppression de l'image
            const department = await prisma.department.findUnique({
                where: { id: parseInt(id) },
            });
    
            if (!department) {
                return res.status(404).json({ error: "Département non trouvé." });
            }
    
            // 4. Supprimer le département
            await prisma.department.delete({
                where: { id: parseInt(id) },
            });
    
            // 5. Supprimer l'image associée
            if (department.image) {
                fs.unlink(department.image, (err) => {
                    if (err) console.error("Erreur lors de la suppression de l'image:", err);
                });
            }
    
            // 6. Journal d'audit
            await logAction(req, "DELETE_DEPARTMENT", "department", parseInt(id), null, {
                sendNotificationEmail: true,
            });
    
            res.status(200).json({ message: "Département supprimé avec succès." });
        } catch (err) {
            console.error(`❌ Erreur DELETE /departments/${req.params.id}:`, err);
            if (err.code === 'P2025') {
                return res.status(404).json({ error: "Département non trouvé." });
            }
            res.status(500).json({ error: "Erreur serveur: " + err.message });
        }
    },

    /**
     * Récupère tous les services pour un département donné.
     */
    getServicesByDepartment: async (req, res) => {
      try {
        const { id } = req.params;
        const services = await prisma.service.findMany({
          where: { department_id: parseInt(id) },
          orderBy: { title: 'asc' },
        });
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
      }
    },

    /**
     * Récupère tous les employés pour un département donné.
     */
    getEmployeesByDepartment: async (req, res) => {
        try {
            const { id } = req.params;
    
            // 1. Trouver les services liés au département
            const services = await prisma.service.findMany({
                where: { department_id: parseInt(id) },
                select: { id: true }
            });
            const serviceIds = services.map(s => s.id);
    
            // 2. Trouver les employés dans ces services
            if (serviceIds.length === 0) {
                return res.status(200).json([]); // Pas de services, donc pas d'employés
            }
    
            const employees = await prisma.employee.findMany({
                where: {
                    service_id: { in: serviceIds }
                },
                select: {
                    id: true,
                    name: true,
                    position: true,
                    email: true,
                },
                orderBy: { name: 'asc' },
            });
    
            res.status(200).json(employees);
        } catch (error) {
            console.error(`❌ Erreur GET /departments/${req.params.id}/employees:`, error);
            res.status(500).json({
                message: "Erreur lors de la récupération des employés du département.",
                error: error.message,
            });
        }
    },

    /**
     * Exporte la liste des employés d'un département en fichier CSV.
     */
    exportEmployeesToCsv: async (req, res) => {
        try {
            const { id } = req.params;
    
            // 1. Récupérer les informations du département
            const department = await prisma.department.findUnique({
                where: { id: parseInt(id) },
                select: { name: true }
            });
    
            if (!department) {
                return res.status(404).json({ error: "Département non trouvé." });
            }
    
            const departmentName = department.name || "export";
            const fileName = `employes_${departmentName.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.csv`;
    
            // 2. Récupérer les IDs des services du département
            const services = await prisma.service.findMany({
                where: { department_id: parseInt(id) },
                select: { id: true }
            });
            const serviceIds = services.map(s => s.id);
    
            // 3. Récupérer les employés de ces services
            let employees = [];
            if (serviceIds.length > 0) {
                employees = await prisma.employee.findMany({
                    where: { service_id: { in: serviceIds } },
                    select: {
                        name: true,
                        position: true,
                        email: true,
                        phone: true,
                    },
                    orderBy: { name: 'asc' },
                });
            }
    
            // 4. Générer le CSV
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    
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
            console.error(`❌ Erreur GET /departments/${req.params.id}/employees/export:`, error);
            res.status(500).json({ message: "Erreur lors de l'exportation CSV." });
        }
    },
  };
};