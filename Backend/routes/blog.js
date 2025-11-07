const express = require("express");
// const router = express.Router(); // Suppression de l'initialisation ici
const blogController = require("../controllers/blogController");
const { verifyToken } = require("../middleware/auth");
const cacheMiddleware = require("../middleware/cache");
const multer = require("multer");

// Configuration de Multer pour stocker temporairement les fichiers uploadés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

/**
 * Initialise et retourne le routeur Express pour la gestion du blog.
 * Le pool est injecté dans le contrôleur pour les opérations DB.
 * @param {object} pool - L'objet de connexion à la base de données MariaDB.
 * @returns {object} Le routeur Express configuré.
 */
module.exports = function (pool) {
  const router = express.Router(); // CRUCIAL : Le routeur est créé ici et le pool est disponible

  // On injecte le pool dans le contrôleur pour qu'il puisse l'utiliser
  const controller = blogController(pool);

  // --- Routes Publiques ---

  // Route pour récupérer tous les articles (paginée, etc.) - publique
  router.get("/", cacheMiddleware(300), controller.getAllPosts); // Cache de 5 minutes

  // Route pour récupérer toutes les catégories uniques - publique
  router.get("/categories", cacheMiddleware(3600), controller.getAllCategories); // Cache de 1 heure

  // Route pour récupérer un article par son ID (pour l'édition) - privée
  router.get("/id/:id", verifyToken, controller.getPostById);

  // Route pour récupérer un article par son slug - publique
  // IMPORTANT: Cette route doit être après les autres pour ne pas intercepter '/categories'
  router.get("/:slug", cacheMiddleware(3600), controller.getPostBySlug); // Cache de 1 heure

  // --- Routes Privées (Admin) ---

  // Route pour l'upload d'images depuis l'éditeur de texte
  router.post(
    "/upload-image",
    verifyToken,
    upload.single("image"),
    controller.uploadImage
  );

  router.post("/", verifyToken, controller.createPost);
  router.put("/:id", verifyToken, controller.updatePost);
  router.delete("/:id", verifyToken, controller.deletePost);

  return router; // Retourne l'instance du routeur
};
