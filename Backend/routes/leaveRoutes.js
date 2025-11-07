const express = require("express");
const leaveController = require("../controllers/leaveController");
const authMiddleware = require("../middleware/authMiddleware");

module.exports = function (pool) {
  const router = express.Router();
  const { protect } = authMiddleware(pool);

  // @route   GET /api/leaves
  // @desc    Récupérer toutes les demandes de congé
  // @access  Private (Admin)
  router.get("/", protect, leaveController.getAllLeaves);

  // @route   POST /api/leaves
  // @desc    Créer une nouvelle demande de congé
  // @access  Private (Admin)
  router.post("/", protect, leaveController.createLeave);

  // @route   PUT /api/leaves/:id
  // @desc    Modifier une demande de congé
  // @access  Private (Admin)
  router.put("/:id", protect, leaveController.updateLeave);

  // @route   DELETE /api/leaves/:id
  // @desc    Supprimer une demande de congé
  // @access  Private (Admin)
  router.delete("/:id", protect, leaveController.deleteLeave);

  return router;
};
