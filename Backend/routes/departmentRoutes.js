const express = require("express");
const multer = require("multer");
const path = require("path");

// Configuration de Multer pour le stockage des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = "uploads/departments/";
    require("fs").mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

module.exports = function (pool) {
  const router = express.Router();
  const departmentController = require("../controllers/departmentController")(
    pool
  );
  const { protect } = require("../middleware/authMiddleware")(pool);

  // Routes publiques
  router.get("/", departmentController.getAllDepartments);

  // Routes protégées (admin)
  router.use(protect);

  router.get("/:id/services", departmentController.getServicesByDepartment);
  router.get("/:id/employees", departmentController.getEmployeesByDepartment);
  router.get(
    "/:id/employees/export",
    departmentController.exportEmployeesToCsv
  );

  router.post(
    "/",
    upload.single("image"),
    departmentController.createDepartment
  );
  router.put(
    "/:id",
    upload.single("image"),
    departmentController.updateDepartment
  );
  router.delete("/:id", departmentController.deleteDepartment);

  return router;
};
