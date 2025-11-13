const { logAction } = require("../services/auditLogService");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

module.exports = function () {
  return {
    /**
     * Récupère tous les services avec les informations du département et le nombre d'employés.
     */
    getAllServices: async (req, res) => {
      try {
        const services = await prisma.service.findMany({
          include: {
            department: true,
            _count: {
              select: { employees: true },
            },
          },
          orderBy: {
            title: "asc",
          },
        });

        // Map services to include employee_count directly
        const servicesWithCount = services.map(service => ({
          ...service,
          employee_count: service._count.employees,
        }));

        res.status(200).json({ services: servicesWithCount });
      } catch (error) {
        console.error("❌ Erreur GET /services:", error);
        res.status(500).json({
          message: "Erreur lors de la récupération des services.",
          error: error.message,
        });
      }
    },

    /**
     * Récupère un service par son ID avec les informations du département.
     */
    getServiceById: async (req, res) => {
      try {
        const { id } = req.params;
        const service = await prisma.service.findUnique({
          where: { id: parseInt(id) },
          include: {
            department: true,
          },
        });

        if (!service) {
          return res.status(404).json({ message: "Service non trouvé." });
        }

        res.status(200).json({ service });
      } catch (error) {
        console.error(`❌ Erreur GET /services/${req.params.id}:`, error);
        res.status(500).json({
          message: "Erreur lors de la récupération du service.",
          error: error.message,
        });
      }
    },

    /**
     * Récupère des services similaires basés sur le même département.
     */
    getSimilarServices: async (req, res) => {
      try {
        const { id } = req.params;
        const { limit = 3 } = req.query;

        const currentService = await prisma.service.findUnique({
          where: { id: parseInt(id) },
          select: { department_id: true },
        });

        if (!currentService || !currentService.department_id) {
          return res.status(200).json({ services: [] });
        }

        const similarServices = await prisma.service.findMany({
          where: {
            department_id: currentService.department_id,
            id: { not: parseInt(id) },
          },
          take: parseInt(limit),
          include: {
            department: true,
          },
        });

        res.status(200).json({ services: similarServices });
      } catch (error) {
        console.error(
          `❌ Erreur GET /services/${req.params.id}/similar:`,
          error
        );
        res.status(500).json({
          message: "Erreur lors de la récupération des services similaires.",
          error: error.message,
        });
      }
    },

    /**
     * Crée un nouveau service.
     */
    createService: async (req, res) => {
      try {
        const { title, description, icon, responsable_id, department_id } =
          req.body;

        if (!title) {
          return res
            .status(400)
            .json({ error: "Le titre du service est requis." });
        }

        const newService = await prisma.service.create({
          data: {
            title,
            description: description || null,
            icon: icon || null,
            responsable_id: responsable_id ? parseInt(responsable_id) : null,
            department_id: department_id ? parseInt(department_id) : null,
          },
        });

        await logAction(req, "CREATE_SERVICE", "service", newService.id);

        res.status(201).json({
          message: "Service créé avec succès.",
          service: newService,
        });
      } catch (err) {
        console.error("❌ Erreur POST /services:", err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      }
    },

    /**
     * Met à jour un service existant.
     */
    updateService: async (req, res) => {
      try {
        const { id } = req.params;
        const { title, description, icon, responsable_id, department_id } =
          req.body;

        const oldService = await prisma.service.findUnique({
          where: { id: parseInt(id) },
        });

        if (!oldService) {
          return res.status(404).json({ error: "Service non trouvé." });
        }

        const updatedService = await prisma.service.update({
          where: { id: parseInt(id) },
          data: {
            title,
            description: description || null,
            icon: icon || null,
            responsable_id: responsable_id ? parseInt(responsable_id) : null,
            department_id: department_id ? parseInt(department_id) : null,
          },
        });

        await logAction(req, "UPDATE_SERVICE", "service", parseInt(id), {
          old: oldService,
          new: updatedService,
        });

        res
          .status(200)
          .json({ message: "Service mis à jour avec succès.", service: updatedService });
      } catch (err) {
        console.error(`❌ Erreur PUT /services/${req.params.id}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      }
    },

    /**
     * Supprime un service.
     */
    deleteService: async (req, res) => {
      try {
        const { id } = req.params;

        const employeeCount = await prisma.employee.count({
          where: { service_id: parseInt(id) },
        });

        if (employeeCount > 0) {
          return res.status(400).json({
            error: `Impossible de supprimer, ce service est assigné à ${employeeCount} employé(s).`,
          });
        }

        await prisma.service.delete({
          where: { id: parseInt(id) },
        });

        await logAction(req, "DELETE_SERVICE", "service", parseInt(id));

        res.status(200).json({ message: "Service supprimé avec succès." });
      } catch (err) {
        console.error(`❌ Erreur DELETE /services/${req.params.id}:`, err);
         if (err.code === 'P2025') {
          return res.status(404).json({ error: "Service non trouvé." });
        }
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      }
    },
  };
};