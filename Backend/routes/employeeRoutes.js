/**
 * Fichier: employeeRoutes.js
 * Description: Définit toutes les routes pour la gestion des employés (CRUD et autres actions).
 */
const express = require("express");
const path = require("path");
const multer = require("multer");

/**
 * Initialise et retourne le routeur Express pour la gestion des employés.
 * @param {object} pool - L'objet de connexion à la base de données MariaDB.
 * @returns {object} Le routeur Express configuré.
 */
module.exports = function (pool) {
  const router = express.Router();

  const JWT_SECRET =
    process.env.JWT_SECRET || "votre_secret_par_defaut_tres_long_et_securise";

  // Importation des fonctions du contrôleur
  const employeeController = require("../controllers/employeeController")(pool);
  const leaveController = require("../controllers/leaveController"); // Pas besoin de pool ici
  const documentController =
    require("../controllers/employeeDocumentController")(pool);

  // Importation des middlewares d'authentification
  const { protect, authorize } = require(path.join(
    __dirname,
    "..",
    "middleware",
    "authMiddleware.js"
  ))(pool, JWT_SECRET);

  const {
    getAllEmployees,
    updateEmployee,
    createEmployee,
    deleteEmployee,
    getUnassignedEmployees,
    getEmployeeById,
    updateEmployeePhoto,
  } = employeeController;

  // Configuration de Multer pour le stockage des images
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Créer le sous-dossier 'documents' s'il n'existe pas
      const dest = "uploads/documents/";
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage });
  const photoUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, "uploads/"),
      filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
    }),
  });

  // --- ROUTES EMPLOYEES ---

  // @route   GET /api/employees
  // @desc    Récupérer tous les employés
  // @access  Private
  router.get("/", protect, getAllEmployees);

  // @route   GET /api/employees/unassigned
  // @desc    Récupérer les employés non assignés
  // @access  Private
  router.get("/unassigned", protect, getUnassignedEmployees);

  // @route   GET /api/employees/:id
  // @desc    Récupérer un employé par son ID
  // @access  Private
  router.get("/:id", protect, getEmployeeById);

  // @route   GET /api/employees/:id/leaves
  // @desc    Récupérer les congés d'un employé
  // @access  Private
  router.get("/:id/leaves", protect, leaveController.getLeavesByEmployee);

  // @route   PUT /api/employees/:id
  // @desc    Modifier un employé
  // @access  Private
  router.put("/:id", protect, photoUpload.none(), updateEmployee); // .none() pour les données de formulaire sans fichier

  // @route   PUT /api/employees/:id/photo
  // @desc    Modifier la photo d'un employé
  // @access  Private
  router.put(
    "/:id/photo",
    protect,
    photoUpload.single("photo"),
    updateEmployeePhoto
  );

  // --- ROUTES DOCUMENTS EMPLOYÉS ---

  // @route   GET /api/employees/:id/documents
  // @desc    Récupérer les documents d'un employé
  // @access  Private
  router.get(
    "/:id/documents",
    protect,
    documentController.getDocumentsForEmployee
  );

  // @route   POST /api/employees/:id/documents
  // @desc    Uploader un document pour un employé
  // @access  Private
  router.post(
    "/:id/documents",
    protect,
    upload.single("document"),
    documentController.uploadDocument
  );

  // @route   DELETE /api/employees/:id/documents/:documentId
  // @desc    Supprimer un document
  // @access  Private
  router.delete(
    "/:id/documents/:documentId",
    protect,
    documentController.deleteDocument
  );

  // @route   POST /api/employees
  // @desc    Créer un nouvel employé (SANS photo - pour compatibilité frontend actuel)
  // @access  Private (Super-Admin)
  router.post(
    "/",
    protect,
    authorize("super-admin"),
    createEmployee // Pas de multer pour accepter le JSON du frontend
  );

  // @route   POST /api/employees/with-photo
  // @desc    Créer un nouvel employé avec photo
  // @access  Private (Super-Admin)
  router.post(
    "/with-photo",
    protect,
    authorize("super-admin"),
    photoUpload.single("photo"),
    createEmployee
  );

  // @route   DELETE /api/employees/:id
  // @desc    Supprimer un employé
  // @access  Private (Super-Admin)
  router.delete("/:id", protect, authorize("super-admin"), deleteEmployee);

  return router;
};
