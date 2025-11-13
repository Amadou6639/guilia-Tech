const express = require("express");
const serviceController = require("../controllers/serviceController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

module.exports = function () {
  const router = express.Router();
  const controller = serviceController();

  // Route publique pour les services
  router.get("/public", controller.getAllServices);

  router.get("/:id", controller.getServiceById);
  router.get("/:id/similar", controller.getSimilarServices);

  // Appliquer l'authentification à toutes les autres routes de services
  router.use(verifyToken);

  router.get("/", controller.getAllServices);
  router.post(
    "/",
    authorizeRoles("super-admin", "admin"),
    controller.createService
  );
  router.put(
    "/:id",
    authorizeRoles("super-admin", "admin"),
    controller.updateService
  );
  router.delete(
    "/:id",
    authorizeRoles("super-admin"),
    controller.deleteService
  );

  return router;
};
