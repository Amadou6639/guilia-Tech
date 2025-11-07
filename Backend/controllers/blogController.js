const sharp = require("sharp");
const fs = require("fs");

/**
 * Fonction utilitaire pour générer un slug à partir d'un texte.
 * @param {string} text - Le titre de l'article.
 * @returns {string} Le slug généré.
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Remplace les espaces par un tiret
    .replace(/[^\w\-]+/g, "") // Supprime tous les caractères non-mots
    .replace(/\-\-+/g, "-") // Remplace les tirets multiples par un seul
    .replace(/^-+/, "") // Supprime les tirets au début
    .replace(/-+$/, ""); // Supprime les tirets à la fin
};

/**
 * Initialise et retourne les méthodes du contrôleur de blog.
 * @param {object} pool - L'objet de connexion à la base de données MariaDB.
 * @returns {object} Un objet contenant toutes les fonctions du contrôleur.
 */
module.exports = function (pool) { // <-- CRUCIAL : Exportation d'une fonction qui prend 'pool'
  
  // L'objet du contrôleur est maintenant retourné par la fonction
  return {
    // Récupérer tous les articles (public, avec pagination, recherche, catégorie)
    getAllPosts: async (req, res) => {
      let conn;
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const search = req.query.search || "";
        const category = req.query.category || "";
        const offset = (page - 1) * limit;

        conn = await pool.getConnection(); // Utilisation du pool injecté

        let whereClauses = [];
        let queryParams = [];

        if (search.trim() !== "") {
          whereClauses.push("(title LIKE ? OR content LIKE ?)");
          queryParams.push(`%${search.trim()}%`, `%${search.trim()}%`);
        }

        if (category.trim() !== "") {
          whereClauses.push("category = ?");
          queryParams.push(category.trim());
        }

        const whereString =
          whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

        // Obtenir le nombre total d'articles
        const totalQuery = `SELECT COUNT(*) as total FROM blog_posts ${whereString}`;
        const totalResult = await conn.query(totalQuery, queryParams);
        const total = Number(totalResult[0].total);

        // Obtenir les articles pour la page actuelle
        const postsQuery = `
          SELECT id, title, slug, excerpt, image_url, category, author, created_at 
          FROM blog_posts 
          ${whereString} 
          ORDER BY created_at DESC 
          LIMIT ? OFFSET ?`;
        const postsParams = [...queryParams, limit, offset];
        const posts = await conn.query(postsQuery, postsParams);

        res.status(200).json({
          posts,
          total,
          page,
          pages: Math.ceil(total / limit),
        });
      } catch (err) {
        console.error("❌ Erreur GET /blog:", err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },

    // Récupérer un article par son ID (pour l'édition)
    getPostById: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        conn = await pool.getConnection();
        const posts = await conn.query("SELECT * FROM blog_posts WHERE id = ?", [
          id,
        ]);
        if (posts.length === 0) {
          return res.status(404).json({ error: "Article non trouvé." });
        }
        res.status(200).json(posts[0]);
      } catch (err) {
        console.error(`❌ Erreur GET /blog/id/${req.params.id}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },

    // Récupérer un article par son slug (pour la page de détail)
    getPostBySlug: async (req, res) => {
      let conn;
      try {
        const { slug } = req.params;
        conn = await pool.getConnection();
        const posts = await conn.query(
          "SELECT * FROM blog_posts WHERE slug = ?",
          [slug]
        );
        if (posts.length === 0) {
          return res.status(404).json({ error: "Article non trouvé." });
        }
        res.status(200).json(posts[0]);
      } catch (err) {
        console.error(`❌ Erreur GET /blog/${req.params.slug}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },

    // Récupérer toutes les catégories uniques
    getAllCategories: async (req, res) => {
      let conn;
      try {
        conn = await pool.getConnection();
        const categories = await conn.query(
          "SELECT DISTINCT category FROM blog_posts WHERE category IS NOT NULL AND category != '' ORDER BY category ASC"
        );
        res.status(200).json(categories.map((c) => c.category));
      } catch (err) {
        console.error("❌ Erreur GET /blog/categories:", err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },

    // Nouvelle fonction pour l'upload d'image depuis l'éditeur
    uploadImage: async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier n'a été uploadé." });
      }

      try {
        const originalPath = req.file.path;
        const newFilename = `post-${Date.now()}.webp`;
        const newPath = `uploads/${newFilename}`;

        // Redimensionner (max 1200px de large), convertir en WebP et compresser
        await sharp(originalPath)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(newPath);

        // Supprimer le fichier original temporaire
        fs.unlinkSync(originalPath);

        // Renvoyer l'URL publique de l'image
        const imageUrl = `/uploads/${newFilename}`;
        res.status(200).json({ imageUrl });
      } catch (err) {
        console.error("❌ Erreur uploadImage:", err);
        res.status(500).json({ error: "Erreur lors du traitement de l'image." });
      }
    },

    // Créer un nouvel article
    createPost: async (req, res) => {
      let conn;
      try {
        const { title, content, excerpt, author, image_url, category } = req.body;
        if (!title || !content || !author) {
          return res
            .status(400)
            .json({ error: "Le titre, le contenu et l'auteur sont requis." });
        }

        const slug = slugify(title);

        conn = await pool.getConnection(); // Utilisation du pool injecté

        // Vérifier si le slug existe déjà
        const existing = await conn.query(
          "SELECT id FROM blog_posts WHERE slug = ?",
          [slug]
        );
        if (existing.length > 0) {
          return res.status(409).json({
            error:
              "Un article avec un titre similaire existe déjà. Veuillez changer le titre.",
          });
        }

        const result = await conn.query(
          "INSERT INTO blog_posts (title, slug, content, excerpt, author, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [title, slug, content, excerpt, author, image_url, category]
        );

        res.status(201).json({
          message: "Article créé avec succès.",
          insertId: result.insertId,
        });
      } catch (err) {
        console.error("❌ Erreur POST /blog:", err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },

    // Mettre à jour un article
    updatePost: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        const { title, content, excerpt, author, image_url, category } = req.body;

        if (!title || !content || !author) {
          return res
            .status(400)
            .json({ error: "Le titre, le contenu et l'auteur sont requis." });
        }

        const slug = slugify(title);

        conn = await pool.getConnection(); // Utilisation du pool injecté

        const result = await conn.query(
          "UPDATE blog_posts SET title = ?, slug = ?, content = ?, excerpt = ?, author = ?, image_url = ?, category = ? WHERE id = ?",
          [title, slug, content, excerpt, author, image_url, category, id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Article non trouvé." });
        }

        res.status(200).json({ message: "Article mis à jour avec succès." });
      } catch (err) {
        console.error(`❌ Erreur PUT /blog/${req.params.id}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },

    // Supprimer un article
    deletePost: async (req, res) => {
      let conn;
      try {
        const { id } = req.params;
        conn = await pool.getConnection(); // Utilisation du pool injecté
        const result = await conn.query("DELETE FROM blog_posts WHERE id = ?", [
          id,
        ]);

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Article non trouvé." });
        }

        res.status(200).json({ message: "Article supprimé avec succès." });
      } catch (err) {
        console.error(`❌ Erreur DELETE /blog/${req.params.id}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      } finally {
        if (conn) conn.release();
      }
    },
  };
};
