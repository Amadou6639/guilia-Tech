/**
 * Fichier: authMiddleware.js
 * Description: Middlewares pour la protection des routes et la gestion des autorisations.
 *
 * NOTE IMPORTANTE : Ce module est une fonction d'usine qui prend le pool et la clé secrète en arguments,
 * ce qui permet d'injecter la connexion à la base de données.
 *
 * @param {object} pool - L'objet de connexion à la base de données MariaDB, injecté depuis le routeur.
 * @returns {object} Un objet contenant les middlewares protect et authorize.
 */
module.exports = function (pool) {
  const jwt = require("jsonwebtoken");
  const JWT_SECRET = process.env.JWT_SECRET;

  const protect = async (req, res, next) => {
    console.log("--- PROTECT MIDDLEWARE ---");
    try {
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer")
      ) {
        console.log("No token found in headers");
        return res
          .status(401)
          .json({ error: "Non autorisé, aucun token fourni." });
      }

      const token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token);
      if (!token || token === "null") {
        console.log("❌ Token is null or invalid");
        console.log("Token is null or invalid");
        return res.status(401).json({ error: "Non autorisé, token invalide." });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Token decoded:", decoded);

      console.log("Querying database for admin with id:", decoded.id);
      const rows = await pool.query(
        "SELECT id, name, email, role FROM admins WHERE id = ?",
        [decoded.id]
      );

      if (!rows || !rows.length) {
        console.log("Admin not found in database for id:", decoded.id);
        return res
          .status(401)
          .json({ error: "Non autorisé, utilisateur non trouvé." });
      }
      if (!rows[0]) {
        return res
          .status(404)
          .json({ error: "Non autorisé, utilisateur non trouvé." });
      }
      if (!rows[0]) {
        return res.status(404).json({ error: "Admin not found" });
      }

      req.admin = rows[0];
      console.log("Admin set on request:", req.admin);
      next();
    } catch (error) {
      console.error("❌ Erreur d'authentification:", error.message);
      console.error("❌ Erreur d'authentification - complet:", error);
      console.error("❌ Erreur d'authentification:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Non autorisé, token expiré." });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Non autorisé, token invalide." });
      }
      // Generic error
      return res
        .status(401)
        .json({ error: "Non autorisé, problème d'authentification." });
    }
  };

  const authorize = (...roles) => {
    return (req, res, next) => {
      console.log("--- AUTHORIZE MIDDLEWARE ---");
      console.log("Required roles:", roles);
      console.log("Request admin object:", req.admin);
      if (!req.admin || !roles.includes(req.admin.role)) {
        const userRole = req.admin ? req.admin.role : "inconnu";
        console.log(`Authorization failed. User role: ${userRole}`);
        return res.status(403).json({
          error: `Accès refusé. Rôle '${userRole}' non autorisé pour cette ressource.`,
        });
      }
      console.log("Authorization successful");
      next();
    };
  };

  return { protect, authorize };
};
