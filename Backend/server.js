const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// Global BigInt serialization fix
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./config/database");
const morgan = require("morgan");
const fs = require("fs");

// --- Paramètres de Sécurité ---
const JWT_SECRET =
  process.env.JWT_SECRET || "votre_secret_par_defaut_tres_long_et_securise";

// NOUVELLE DÉFINITION : Cette variable lira l'URL de votre frontend React
// fournie par Render (ou utilisera localhost en développement).
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const app = express();

app.set("etag", false);

// Middleware
app.use(
  cors({
    // Utilise la variable CORS_ORIGIN (l'URL de votre frontend en production)
    origin: [CORS_ORIGIN], 
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// --- UTILISATION DES ROUTES ---

const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  // On s'assure que c'est un fichier JS et pas un fichier de config
  if (file.endsWith(".js")) {
    const routeName = file.replace(".js", "");
    const routeModule = require(path.join(routesPath, file));

    // Le nom de la route est dérivé du nom du fichier
    // ex: jobRoutes.js -> /api/jobs, functionRoutes.js -> /api/functions
    let baseName = routeName.replace("Routes", "").toLowerCase();
    // Correction pour gérer les pluriels : 'function' -> 'functions', 'job' -> 'jobs', etc.
    if (baseName === 'salary') {
      baseName = 'salaries';
    } else if (baseName === 'contact') {
      baseName = 'contact';
    } else if (!baseName.endsWith('s')) {
      baseName += 's';
    }

    const apiPath = `/api/${baseName}`;

    if (typeof routeModule === "function") {
      // Cas spécial pour la route d'authentification qui a plus d'arguments
      if (routeName === "auth") {
        const authApiPath = "/api/auth"; // Correction du chemin pour l'authentification
        const { verifyToken, authorizeRoles } = require("./middleware/auth");
        app.use(
          authApiPath,
          routeModule(pool, JWT_SECRET, { verifyToken, authorizeRoles })
        );
        console.log(`✅ Route chargée dynamiquement : ${authApiPath}`);
      } else if (routeName === "blog") {
        const blogApiPath = "/api/blog"; // Correction pour la route du blog
        app.use(blogApiPath, routeModule(pool));
        console.log(`✅ Route chargée dynamiquement : ${blogApiPath}`);
      } else if (routeName === "serviceRoutes" || routeName === "departmentRoutes") {
        app.use(apiPath, routeModule(pool));
        console.log(`✅ Route chargée dynamiquement : ${apiPath}`);
      } else {
        // Cas général pour les autres routes
        if(routeModule && typeof routeModule === 'function'){
          app.use(apiPath, routeModule(pool));
          console.log(`✅ Route chargée dynamiquement : ${apiPath}`);
        }
      }
    }
  }
});

// Routes de test
app.get("/api/test", async (req, res) => {
  res.json({ message: "API MariaDB fonctionne!" });
});

app.get("/api/health", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT 1 as test");
    conn.release();
    res.json({
      status: "OK",
      database: "Connecté",
      test: result[0].test,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      database: "Déconnecté",
      error: error.message,
    });
  }
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur non gérée:", err.stack);
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(403).json({ error: "Token invalide ou expiré." });
  }
  res.status(500).json({ error: "Une erreur interne est survenue." });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Logique d'initialisation de la base de données ici
    console.log("🚀 Initialisation de la base de données...");

    // Test de connexion à la base de données
    const conn = await pool.getConnection();
    console.log("✅ Connexion à la base de données réussie");
    conn.release();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📊 Utilisation de MariaDB comme base de données`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log("✅ Toutes les routes sont configurées (même temporaires)");
    });
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur:", error);
    process.exit(1);
  }
};

startServer();
