const express = require("express");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const cacheMiddleware = require("../middleware/cache");
const fs = require("fs");

// ⚠️ CORRECTION : Importation du middleware d'authentification sous forme de fonction d'usine
const authMiddlewareFactory = require(path.join(__dirname, '..', 'middleware', 'authMiddleware.js'));

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // S'assurer que le dossier 'uploads' existe
    if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
    }
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Nous générerons le nom de fichier final dans le gestionnaire de route
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/**
 * Initialise et retourne le routeur Express pour la gestion des partenaires.
 * @param {object} pool - L'objet de connexion à la base de données MariaDB.
 * @returns {object} Le routeur Express configuré.
 */
module.exports = function (pool) {
  const router = express.Router(); 
  
  // Récupération de la clé secrète et initialisation du middleware
  const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_par_defaut_tres_long_et_securise";
  const { protect } = authMiddlewareFactory(pool, JWT_SECRET);

  // GET all partners
  // @route   GET /api/partners
  // @access  Public
  // Ajout de cacheMiddleware pour optimiser les requêtes fréquentes
  // Ajout de cacheMiddleware pour optimiser les requêtes fréquentes
  router.get("/", cacheMiddleware(3600), async (req, res) => { 
    let client;
    try {
      client = await pool.connect();
      const partners = await client.query(
        "SELECT * FROM partners ORDER BY name ASC"
      );
      res.json(partners.rows);
    } catch (err) {
      console.error("❌ Erreur GET /partners:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (client) client.release();
    }
  });

  // POST a new partner
  // @route   POST /api/partners
  // @access  Private (Admin)
  // ⚠️ CORRECTION : Utilisation de 'protect' au lieu de 'verifyToken'
  router.post("/", protect, upload.single("logo"), async (req, res) => {
    let client;
    try {
      const { name, website_url } = req.body;
      let logo_url = null;

      if (!name) {
        return res.status(400).json({ error: "Le nom du partenaire est requis" });
      }

      if (req.file) {
        const originalPath = req.file.path;
        const newFilename = `${Date.now()}.webp`;
        const newPath = path.join("uploads", newFilename);

        // Process image with sharp: resize, convert to webp, and compress
        await sharp(originalPath)
          .resize({ width: 400, withoutEnlargement: true }) // Resize to a max width of 400px
          .webp({ quality: 80 }) // Convert to WebP with 80% quality
          .toFile(newPath);

        // Delete the original uploaded file
        fs.unlinkSync(originalPath);

        logo_url = `/uploads/${newFilename}`;
      }

      client = await pool.connect();
      const result = await client.query(
        "INSERT INTO partners (name, logo_url, website_url) VALUES ($1, $2, $3) RETURNING id",
        [name, logo_url, website_url]
      );

      res.status(201).json({
        message: "Partenaire ajouté",
        id: result.rows[0].id,
      });
    } catch (err) {
      console.error("❌ Erreur POST /partners:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (client) client.release();
    }
  });

  // DELETE a partner
  // @route   DELETE /api/partners/:id
  // @access  Private (Admin)
  // ⚠️ CORRECTION : Utilisation de 'protect' au lieu de 'verifyToken'
  router.delete("/:id", protect, async (req, res) => {
    let client;
    try {
      const partnerId = req.params.id;

      client = await pool.connect();
      const result = await client.query("DELETE FROM partners WHERE id = $1", [
        partnerId,
      ]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Partenaire non trouvé" });
      }

      res.json({ message: "Partenaire supprimé avec succès" });
    } catch (err) {
      console.error("❌ Erreur DELETE /partners:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } finally {
      if (client) client.release();
    }
  });

  // UPDATE a partner
  // @route   PUT /api/partners/:id
  // @access  Private (Admin)
  router.put("/:id", protect, upload.single("logo"), async (req, res) => {
    let client;
    try {
      const partnerId = req.params.id;
      const { name, website_url } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Le nom du partenaire est requis" });
      }

      client = await pool.connect();

      // Check if partner exists and get old logo URL
      const partnerResult = await client.query("SELECT logo_url FROM partners WHERE id = $1", [partnerId]);
      if (partnerResult.rows.length === 0) {
        return res.status(404).json({ error: "Partenaire non trouvé" });
      }
      const partner = partnerResult.rows[0];

      let logo_url = partner.logo_url; // Keep old logo by default

      if (req.file) {
        // If there was an old logo, delete it
        if (partner.logo_url) {
          const oldLogoPath = path.join(__dirname, '..', partner.logo_url);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        }

        const originalPath = req.file.path;
        const newFilename = `${Date.now()}.webp`;
        const newPath = path.join("uploads", newFilename);

        await sharp(originalPath)
          .resize({ width: 400, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(newPath);

        fs.unlinkSync(originalPath);
        logo_url = `/uploads/${newFilename}`;
      }

      const result = await client.query(
        "UPDATE partners SET name = $1, logo_url = $2, website_url = $3 WHERE id = $4",
        [name, logo_url, website_url, partnerId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Partenaire non trouvé" });
      }

      res.json({ message: "Partenaire mis à jour avec succès" });
    } catch (err) {
      console.error("❌ Erreur PUT /partners:", err);
      res.status(500).json({ error: "Erreur serveur: " + err.message });
    } finally {
      if (client) client.release();
    }
  });

  return router; // <--- Retourne l'instance du routeur
};
