const pool = require("../config/database");
const crypto = require("crypto");

const subscriberController = {
  /**
   * @route   POST /api/subscribers
   * @desc    Inscrire un nouvel abonné à la newsletter
   * @access  Public
   */
  subscribe: async (req, res) => {
    const { email, fullName, phoneNumber } = req.body;

    if (!email) {
      return res.status(400).json({ error: "L'adresse email est requise." });
    }

    let conn;
    try {
      conn = await pool.getConnection();

      // Vérifier si l'email existe déjà
      const existingSubscriber = await conn.query(
        "SELECT id FROM subscribers WHERE email = ?",
        [email]
      );

      if (existingSubscriber.length > 0) {
        return res
          .status(409)
          .json({ error: "Cette adresse email est déjà abonnée." });
      }

      // Générer un token de confirmation
      const token = crypto.randomBytes(20).toString('hex');

      // Insérer le nouvel abonné
      const result = await conn.query(
        "INSERT INTO subscribers (email, full_name, phone_number, token) VALUES (?, ?, ?, ?)",
        [email, fullName || null, phoneNumber || null, token]
      );

      res
        .status(201)
        .json({ message: "Abonnement réussi !", id: result.insertId });
    } catch (err) {
      console.error("❌ Erreur POST /api/subscribers:", err);
      res.status(500).json({ error: "Erreur serveur lors de l'abonnement." });
    } finally {
      if (conn) conn.release();
    }
  },
  /**
   * @route   GET /api/subscribers
   * @desc    Récupérer tous les abonnés
   * @access  Private (Admin)
   */
  getAllSubscribers: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const subscribers = await conn.query(
        "SELECT id, email, full_name, phone_number, confirmed, created_at FROM subscribers ORDER BY created_at DESC"
      );
      res.status(200).json(subscribers);
    } catch (err) {
      console.error("❌ Erreur GET /api/subscribers:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },

  /**
   * @route   DELETE /api/subscribers/:id
   * @desc    Supprimer un abonné
   * @access  Private (Admin)
   */
  deleteSubscriber: async (req, res) => {
    let conn;
    const { id } = req.params;

    try {
      conn = await pool.getConnection();
      const result = await conn.query("DELETE FROM subscribers WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Abonné non trouvé." });
      }

      res.status(200).json({ message: "Abonné supprimé avec succès." });
    } catch (err) {
      console.error(`❌ Erreur DELETE /api/subscribers/${id}:`, err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (conn) conn.release();
    }
  },
};

module.exports = subscriberController;
