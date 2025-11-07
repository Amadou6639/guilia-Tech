const express = require("express");
const router = express.Router();
const createFunctionController = require("../controllers/functionController");
const authMiddleware = require("../middleware/authMiddleware");

module.exports = function (pool) {
  const { protect } = authMiddleware(pool);
  const functionController = createFunctionController(pool);

  // @route   GET /api/functions (anciennement /api/jobs)
  // @desc    Récupérer toutes les fonctions
  // @access  Private (Admin)
  router.get("/", protect, functionController.getAllFunctions);

  // @route   POST /api/functions
  // @desc    Créer une nouvelle fonction
  // @access  Private (Admin)
  router.post("/", protect, functionController.createFunction);

  // @route   PUT /api/functions/:id
  // @desc    Modifier une fonction
  // @access  Private (Admin)
  router.put("/:id", protect, functionController.updateFunction);

  // @route   DELETE /api/functions/:id
  // @desc    Supprimer une fonction
  // @access  Private (Admin)
  router.delete("/:id", protect, functionController.deleteFunction);

  return router;
};
