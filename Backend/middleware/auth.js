const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Accès refusé. Token manquant ou mal formaté." });
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "null") {
    return res.status(401).json({ message: "Accès refusé. Token invalide." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Utilisons req.admin pour être cohérent
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expiré." });
    }
    return res.status(401).json({ message: "Token invalide." });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !req.admin.role) {
      return res
        .status(403)
        .json({ message: "Accès refusé. Rôle utilisateur non trouvé." });
    }
    if (!roles.includes(req.admin.role)) {
      return res
        .status(403)
        .json({
          message: `Accès refusé. Rôle '${req.admin.role}' non autorisé.`,
        });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
