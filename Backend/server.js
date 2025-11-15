const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// Global BigInt serialization fix
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./config/database"); // Vérifiez ce chemin
const morgan = require("morgan");
const fs = require("fs");

// --- Paramètres de Sécurité ---
const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_par_defaut_tres_long_et_securise";

// CORRECTION IMPORTANTE POUR RAILWAY :
// En production, Railway fournit une URL, en développement on utilise localhost:3000 (React)
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const app = express();

app.set("etag", false);

// Middleware
app.use(
  cors({
    origin: [CORS_ORIGIN, "http://localhost:3000"], // Multiple origins pour flexibilité
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
  if (file.endsWith(".js")) {
    const routeName = file.replace(".js", "");
    const routeModule = require(path.join(routesPath, file));

    let baseName = routeName.replace("Routes", "").toLowerCase();
    if (baseName === 'salary') {
      baseName = 'salaries';
    } else if (baseName === 'contact') {
      baseName = 'contact';
    } else if (!baseName.endsWith('s')) {
      baseName += 's';
    }

    const apiPath = `/api/${baseName}`;

    if (typeof routeModule === "function") {
      if (routeName === "auth") {
        const authApiPath = "/api/auth";
        const { verifyToken, authorizeRoles } = require("./middleware/auth");
        app.use(
          authApiPath,
          routeModule(pool, JWT_SECRET, { verifyToken, authorizeRoles })
        );
        console.log(`✅ Route chargée dynamiquement : ${authApiPath}`);
      } else if (routeName === "blog") {
        const blogApiPath = "/api/blog";
        app.use(blogApiPath, routeModule(pool));
        console.log(`✅ Route chargée dynamiquement : ${blogApiPath}`);
      } else if (routeName === "serviceRoutes" || routeName === "departmentRoutes") {
        app.use(apiPath, routeModule(pool));
        console.log(`✅ Route chargée dynamiquement : ${apiPath}`);
      } else {
        if(routeModule && typeof routeModule === 'function'){
          app.use(apiPath, routeModule(pool));
          console.log(`✅ Route chargée dynamiquement : ${apiPath}`);
        }
      }
    }
  }
});

// Routes de test améliorées pour Railway
app.get("/api/test", async (req, res) => {
  res.json({ 
    message: "API MariaDB fonctionne!",
    environment: process.env.NODE_ENV || 'development',
    platform: 'Railway'
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT 1 as test, NOW() as db_time, DATABASE() as db_name");
    conn.release();
    res.json({
      status: "OK",
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: "Connecté",
        name: result[0].db_name,
        time: result[0].db_time
      },
      server_time: new Date().toISOString(),
      platform: "Railway"
    });
  } catch (error) {
    console.error("❌ Erreur de santé DB:", error);
    res.status(500).json({
      status: "ERROR",
      database: "Déconnecté",
      error: error.message,
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Route info système pour debug Railway
app.get("/api/system-info", (req, res) => {
  res.json({
    node_version: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV || 'development',
    database_host: process.env.MYSQLHOST || 'localhost',
    database_name: process.env.MYSQLDATABASE || 'guilla_tech',
    cors_origin: CORS_ORIGIN,
    railway: !!process.env.RAILWAY_ENVIRONMENT
  });
});
// Ajoutez cette route après les autres routes
app.get("/api/system-info", (req, res) => {
  res.json({
    node_version: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV || 'development',
    database_host: process.env.MYSQLHOST || 'localhost',
    database_name: process.env.MYSQLDATABASE || 'defaultdb',
    railway: false,
    render: true
  });
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
    console.log("🚀 Initialisation de la base de données...");

    // Test de connexion amélioré
    const conn = await pool.getConnection();
    const dbInfo = await conn.query("SELECT DATABASE() as db_name, VERSION() as version");
    console.log("✅ Connexion à la base de données réussie");
    console.log(`📊 Base: ${dbInfo[0].db_name}`);
    console.log(`🔧 Version MariaDB: ${dbInfo[0].version}`);
    conn.release();

    app.listen(PORT, '0.0.0.0', () => {  // Important: écouter sur 0.0.0.0 pour Railway
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📊 Utilisation de MariaDB comme base de données`);
      console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
      console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log("✅ Toutes les routes sont configurées");
      
      // URLs de test
      console.log(`🧪 Test santé: http://0.0.0.0:${PORT}/api/health`);
      console.log(`🔍 Info système: http://0.0.0.0:${PORT}/api/system-info`);
    });
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur:", error);
    console.error("🔍 Détails de l'erreur:", error.message);
    process.exit(1);
  }
};

startServer();