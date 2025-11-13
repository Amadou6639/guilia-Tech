const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// GET toutes les requêtes avec pagination
exports.getRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Construction de la query
    const where = search.trim() !== '' ? {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
        { besoin: { contains: search } }
      ]
    } : {};

    const requests = await prisma.request.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        date_creation: 'desc'
      }
    });

    const total = await prisma.request.count({ where });
    const totalPages = Math.ceil(total / limit);

    res.json({
      requests,
      page,
      pages: totalPages,
      total,
      limit
    });
  } catch (error) {
    console.error('❌ Erreur getRequests:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE une requête
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.request.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Requête supprimée' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Requête non trouvée' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// UPDATE une requête
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await prisma.request.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.json({ message: 'Requête modifiée', request });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Requête non trouvée' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
