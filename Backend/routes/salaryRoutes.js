const express = require("express");
const salaryController = require("../controllers/salaryController");
const authMiddleware = require("../middleware/authMiddleware");

module.exports = function (pool) {
  const router = express.Router();
  const { protect } = authMiddleware(pool);

  // @route   GET /api/salaries
  // @desc    Récupérer tous les salaires
  // @access  Private (Admin)
  router.get("/", protect, salaryController.getAllSalaries);

  // @route   POST /api/salaries
  // @desc    Créer une nouvelle entrée de salaire
  // @access  Private (Admin)
  router.post("/", protect, salaryController.createSalary);

  // @route   PUT /api/salaries/:id
  // @desc    Modifier un salaire
  // @access  Private (Admin)
  router.put("/:id", protect, salaryController.updateSalary);

  // @route   DELETE /api/salaries/:id
  // @desc    Supprimer un salaire
  // @access  Private (Admin)
  router.delete("/:id", protect, salaryController.deleteSalary);

  return router;
};
