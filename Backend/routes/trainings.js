const express = require('express');
const path = require('path');
// Importation du contrôleur de formation sous forme de fonction d'usine
const createTrainingController = require('../controllers/trainingController'); 
// Importation du middleware d'authentification sous forme de fonction d'usine
const authMiddlewareFactory = require(path.join(__dirname, '..', 'middleware', 'authMiddleware.js'));

/**
 * Initialise et retourne le routeur Express pour la gestion des formations.
 * @param {object} pool - L'objet de connexion à la base de données MariaDB.
 * @returns {object} Le routeur Express configuré.
 */
module.exports = function(pool) {
    const router = express.Router();
    
    // Récupération de la clé secrète et initialisation du middleware
    const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_par_defaut_tres_long_et_securise";
    const { protect } = authMiddlewareFactory(pool, JWT_SECRET);

    // Initialisation du contrôleur en lui injectant le pool
    const trainingController = createTrainingController(pool);

    // N'utilisez PAS router.use(protect) ici.
    // Appliquez la protection sur chaque route individuellement.
    router.get('/', trainingController.getAllTrainings);
    router.post('/', protect, trainingController.createTraining);
    router.delete('/:id', protect, trainingController.deleteTraining);

    return router;
};
