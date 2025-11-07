const Request = require('../models/Request');

// GET toutes les requêtes avec pagination
exports.getRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Construction de la query
    let query = {};
    if (search.trim() !== '') {
      query = {
        $or: [
          { nom: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { besoin: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const requests = await Request.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Request.countDocuments(query);
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
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Requête non trouvée' });
    }
    res.json({ message: 'Requête supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// UPDATE une requête
exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!request) {
      return res.status(404).json({ error: 'Requête non trouvée' });
    }
    res.json({ message: 'Requête modifiée', request });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};