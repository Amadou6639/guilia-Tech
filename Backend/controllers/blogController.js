const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
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

module.exports = function () {
  return {
    // Récupérer tous les articles (public, avec pagination, recherche, catégorie)
    getAllPosts: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const search = req.query.search || "";
        const category = req.query.category || "";
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
          where.OR = [
            { title: { contains: search } },
            { content: { contains: search } },
          ];
        }
        if (category) {
          where.category = category;
        }

        const posts = await prisma.blogPost.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: {
            created_at: "desc",
          },
        });

        const total = await prisma.blogPost.count({ where });

        res.status(200).json({
          posts,
          total,
          page,
          pages: Math.ceil(total / limit),
        });
      } catch (err) {
        console.error("❌ Erreur GET /blog:", err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      }
    },

    // Récupérer un article par son ID (pour l'édition)
    getPostById: async (req, res) => {
      try {
        const { id } = req.params;
        const post = await prisma.blogPost.findUnique({
          where: { id: parseInt(id) },
        });
        if (!post) {
          return res.status(404).json({ error: "Article non trouvé." });
        }
        res.status(200).json(post);
      } catch (err) {
        console.error(`❌ Erreur GET /blog/id/${req.params.id}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      }
    },

    // Récupérer un article par son slug (pour la page de détail)
    getPostBySlug: async (req, res) => {
      try {
        const { slug } = req.params;
        const post = await prisma.blogPost.findUnique({
          where: { slug },
        });
        if (!post) {
          return res.status(404).json({ error: "Article non trouvé." });
        }
        res.status(200).json(post);
      } catch (err) {
        console.error(`❌ Erreur GET /blog/${req.params.slug}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      }
    },

    // Récupérer toutes les catégories uniques
    getAllCategories: async (req, res) => {
      try {
        const categories = await prisma.blogPost.findMany({
          where: {
            category: {
              not: null,
              not: "",
            },
          },
          distinct: ["category"],
          orderBy: {
            category: "asc",
          },
        });
        res.status(200).json(categories.map((c) => c.category));
      } catch (err) {
        console.error("❌ Erreur GET /blog/categories:", err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
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
      try {
        const { title, content, excerpt, author, image_url, category, created_at } =
          req.body;
        if (!title || !content || !author) {
          return res
            .status(400)
            .json({ error: "Le titre, le contenu et l'auteur sont requis." });
        }

        const slug = slugify(title);

        const newPost = await prisma.blogPost.create({
          data: {
            title,
            slug,
            content,
            excerpt,
            author,
            image_url,
            category,
            created_at: created_at ? new Date(created_at) : new Date(),
          },
        });

        res.status(201).json({
          message: "Article créé avec succès.",
          post: newPost,
        });
      } catch (err) {
        if (err.code === "P2002") {
          return res.status(409).json({
            error:
              "Un article avec un titre similaire existe déjà. Veuillez changer le titre.",
          });
        }
        console.error("❌ Erreur POST /blog:", err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      }
    },

    // Mettre à jour un article
    updatePost: async (req, res) => {
      try {
        const { id } = req.params;
        const {
          title,
          content,
          excerpt,
          author,
          image_url,
          category,
          created_at,
        } = req.body;

        if (!title || !content || !author) {
          return res
            .status(400)
            .json({ error: "Le titre, le contenu et l'auteur sont requis." });
        }

        const slug = slugify(title);

        const updatedPost = await prisma.blogPost.update({
          where: { id: parseInt(id) },
          data: {
            title,
            slug,
            content,
            excerpt,
            author,
            image_url,
            category,
            created_at: created_at ? new Date(created_at) : undefined,
          },
        });

        res.status(200).json({ message: "Article mis à jour avec succès.", post: updatedPost });
      } catch (err) {
        if (err.code === "P2025") {
          return res.status(404).json({ error: "Article non trouvé." });
        }
        console.error(`❌ Erreur PUT /blog/${req.params.id}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      }
    },

    // Supprimer un article
    deletePost: async (req, res) => {
      try {
        const { id } = req.params;
        await prisma.blogPost.delete({
          where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Article supprimé avec succès." });
      } catch (err) {
        if (err.code === "P2025") {
          return res.status(404).json({ error: "Article non trouvé." });
        }
        console.error(`❌ Erreur DELETE /blog/${req.params.id}:`, err);
        res.status(500).json({ error: "Erreur serveur: " + err.message });
      }
    },
  };
};
