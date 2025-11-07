const express = require("express");
const subscriberController = require("../controllers/subscriberController");
const authMiddleware = require("../middleware/authMiddleware");

module.exports = function (pool) {
  const router = express.Router();
  const { protect } = authMiddleware(pool);

  /**
   * @route   POST /api/subscriber
   * @desc    Inscrire un nouvel abonné à la newsletter
   * @access  Public
   */
  router.post("/", subscriberController.subscribe);

  /**
   * @route   GET /api/subscriber
   * @desc    Récupérer tous les abonnés
   * @access  Private (Admin)
   */
  router.get("/", protect, subscriberController.getAllSubscribers);

  /**
   * @route   DELETE /api/subscriber/:id
   * @desc    Supprimer un abonné
   * @access  Private (Admin)
   */
  router.delete("/:id", protect, subscriberController.deleteSubscriber);

  return router;
};
