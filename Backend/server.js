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
const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_par_defaut_tres_long_et_securise_pour_render";

// CONFIGURATION POUR RENDER :
// En production, Render fournit une URL, en développement on utilise localhost:3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const app = express();

app.set("etag", false);

// Middleware CORS pour Render
app.use(
  cors({
    origin: [
      CORS_ORIGIN, 
      "http://localhost:3000", 
      "https://votre-frontend.onrender.com",
      "http://localhost:5173", // Vite dev server
      "https://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

// Middleware standard
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========== ROUTES TEMPORAIRES POUR DÉBLOQUER L'APPLICATION ==========

// Route temporaire pour les services publics
app.get('/api/services/public', async (req, res) => {
  try {
    console.log("📦 Route temporaire services/public appelée");
    res.json([
      { 
        id: 1, 
        name: "Développement Web", 
        description: "Création de sites web et applications modernes",
        image: "/images/service-web.jpg",
        active: true
      },
      { 
        id: 2, 
        name: "Formation Digitale", 
        description: "Formations sur les technologies numériques",
        image: "/images/service-formation.jpg", 
        active: true
      },
      { 
        id: 3, 
        name: "Conseil IT", 
        description: "Audit et optimisation de vos systèmes informatiques",
        image: "/images/service-conseil.jpg",
        active: true
      }
    ]);
  } catch (error) {
    console.error("Erreur route temporaire services:", error);
    res.status(500).json({ error: "Erreur serveur temporaire" });
  }
});

// Route temporaire pour le blog
app.get('/api/blog', async (req, res) => {
  try {
    console.log("📝 Route temporaire blog appelée");
    res.json([
      {
        id: 1,
        title: "Bienvenue sur Guilia Tech",
        excerpt: "Découvrez nos services et solutions innovantes",
        content: "Contenu de l'article de bienvenue...",
        image: "/images/blog-welcome.jpg",
        created_at: new Date().toISOString(),
        published: true
      },
      {
        id: 2, 
        title: "Les tendances tech 2024",
        excerpt: "Les technologies qui vont transformer votre entreprise",
        content: "Contenu sur les tendances technologiques...",
        image: "/images/blog-tendances.jpg",
        created_at: new Date().toISOString(),
        published: true
      }
    ]);
  } catch (error) {
    console.error("Erreur route temporaire blog:", error);
    res.status(500).json({ error: "Erreur serveur temporaire" });
  }
});

// Route temporaire pour les formations
app.get('/api/trainings', async (req, res) => {
  try {
    console.log("🎓 Route temporaire trainings appelée");
    res.json([
      {
        id: 1,
        title: "React Avancé",
        description: "Maîtrisez React avec les hooks et le state management",
        duration: "3 jours",
        level: "Avancé",
        image: "/images/formation-react.jpg",
        active: true
      },
      {
        id: 2,
        title: "Node.js & Express",
        description: "Créez des APIs robustes avec Node.js et Express",
        duration: "2 jours", 
        level: "Intermédiaire",
        image: "/images/formation-node.jpg",
        active: true
      }
    ]);
  } catch (error) {
    console.error("Erreur route temporaire trainings:", error);
    res.status(500).json({ error: "Erreur serveur temporaire" });
  }
});

// Route temporaire pour les partenaires
app.get('/api/partners', async (req, res) => {
  try {
    console.log("🤝 Route temporaire partners appelée");
    res.json([
      {
        id: 1,
        name: "Tech Solutions Inc.",
        logo_url: "/images/partner-tech.png",
        website: "https://techsolutions.com",
        active: true
      },
      {
        id: 2,
        name: "Digital Innovators",
        logo_url: "/images/partner-digital.png", 
        website: "https://digitalinnovators.com",
        active: true
      },
      {
        id: 3,
        name: "Web Masters",
        logo_url: "/images/partner-web.png",
        website: "https://webmasters.com",
        active: true
      }
    ]);
  } catch (error) {
    console.error("Erreur route temporaire partners:", error);
    res.status(500).json({ error: "Erreur serveur temporaire" });
  }
});

// ========== FIN DES ROUTES TEMPORAIRES ==========

// Route racine pour Render
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Backend déployé sur Render avec succès!",
    environment: process.env.NODE_ENV || 'development',
    status: "Actif",
    timestamp: new Date().toISOString(),
    platform: "Render",
    endpoints: {
      health: "/api/health",
      system: "/api/system-info",
      test: "/api/test"
    }
  });
});

// --- UTILISATION DES ROUTES ---
const routesPath = path.join(__dirname, "routes");
try {
  if (fs.existsSync(routesPath)) {
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
    console.log("✅ Toutes les routes ont été chargées avec succès");
  } else {
    console.log("⚠️ Dossier routes non trouvé, chargement des routes ignoré");
  }
} catch (error) {
  console.error("❌ Erreur lors du chargement des routes:", error);
}

// Routes de test améliorées pour Render
app.get("/api/test", async (req, res) => {
  res.json({ 
    message: "🚀 API backend fonctionne parfaitement sur Render!",
    environment: process.env.NODE_ENV || 'development',
    platform: 'Render',
    timestamp: new Date().toISOString(),
    status: "success"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    // Test de connexion à la base de données
    let dbStatus = "Non configuré";
    let dbInfo = {};
    
    if (pool) {
      try {
        const client = await pool.connect();
        const result = await client.query("SELECT 1 as test, NOW() as db_time, current_database() as db_name, version() as version");
        client.release();
        dbStatus = "Connecté";
        dbInfo = {
          name: result.rows[0].db_name,
          time: result.rows[0].db_time,
          version: result.rows[0].version
        };
      } catch (dbError) {
        dbStatus = `Erreur: ${dbError.message}`;
      }
    }

    res.json({
      status: "OK",
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        ...dbInfo
      },
      server_time: new Date().toISOString(),
      platform: "Render",
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error("❌ Erreur de santé:", error);
    res.status(500).json({
      status: "ERROR",
      database: "Erreur de test",
      error: error.message,
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Route info système pour debug Render
app.get("/api/system-info", (req, res) => {
  res.json({
    node_version: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV || 'development',
    database_host: process.env.MYSQLHOST || process.env.DATABASE_HOST || 'non configuré',
    database_name: process.env.MYSQLDATABASE || process.env.DATABASE_NAME || 'non configuré',
    cors_origin: CORS_ORIGIN,
    render: !!process.env.RENDER,
    external_url: process.env.RENDER_EXTERNAL_URL || 'non disponible',
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
    }
  });
});

// Route de test de base de données
app.get("/api/test-db", async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ 
        error: "Pool de base de données non configuré",
        solution: "Vérifiez les variables d'environnement DATABASE_URL"
      });
    }

    const client = await pool.connect();
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    client.release();
    
    res.json({
      status: "success",
      database: "Connecté avec succès",
      tables_count: tables.rows.length,
      tables: tables.rows.map(t => t.table_name),
      message: "✅ Base de données opérationnelle"
    });
  } catch (error) {
    console.error("❌ Erreur DB:", error);
    res.status(500).json({
      status: "error",
      error: error.message,
      solution: "Vérifiez la configuration de la base de données dans Render"
    });
  }
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur non gérée:", err.stack);
  
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(403).json({ error: "Token invalide ou expiré." });
  }
  
  // Erreur de limite de taille
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: "Fichier trop volumineux" });
  }
  
  res.status(500).json({ 
    error: "Une erreur interne est survenue.",
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route non trouvée",
    path: req.path,
    method: req.method,
    available_endpoints: [
      "GET /",
      "GET /api/health", 
      "GET /api/system-info",
      "GET /api/test",
      "GET /api/test-db"
    ]
  });
});

// Configuration du port pour Render
const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    console.log("🚀 Démarrage du serveur sur Render...");
    console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Port: ${PORT}`);
    
    // Test de connexion à la base de données si configurée
    if (pool) {
      try {
        const client = await pool.connect();
        const dbInfo = await client.query("SELECT current_database() as db_name, version() as version, NOW() as server_time");
        console.log("✅ Connexion à la base de données réussie");
        console.log(`📊 Base: ${dbInfo.rows[0].db_name}`);
        console.log(`🔧 Version DB: ${dbInfo.rows[0].version}`);
        client.release();
      } catch (dbError) {
        console.log("⚠️ Base de données non disponible:", dbError.message);
        console.log("💡 Configurez DATABASE_URL dans les variables d'environnement Render");
      }
    } else {
      console.log("⚠️ Configuration de base de données manquante");
    }

    // Démarrage du serveur
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎉 Serveur démarré avec succès sur le port ${PORT}`);
      console.log(`🌐 URL locale: http://localhost:${PORT}`);
      console.log(`🌐 URL Render: ${process.env.RENDER_EXTERNAL_URL || 'À configurer'}`);
      console.log("✅ Prêt à recevoir des requêtes");
      
      // URLs de test
      console.log("\n🔍 Endpoints de test:");
      console.log(`   🏠 Accueil: /`);
      console.log(`   ❤️  Santé: /api/health`);
      console.log(`   🔧 Système: /api/system-info`);
      console.log(`   🧪 Test: /api/test`);
      console.log(`   🗄️  Test DB: /api/test-db`);
    });
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur:", error);
    console.error("🔍 Détails de l'erreur:", error.message);
    process.exit(1);
  }
};

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('🛑 Réception SIGTERM, arrêt propre du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Réception SIGINT, arrêt du serveur...');
  process.exit(0);
});

// Démarrage du serveur
startServer();