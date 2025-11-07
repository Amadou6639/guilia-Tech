const NodeCache = require("node-cache");

// stdTTL: durée de vie par défaut d'une entrée en cache (en secondes). 10 minutes est un bon début.
// checkperiod: intervalle de vérification des clés expirées.
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Middleware pour mettre en cache les réponses des requêtes GET.
 * @param {number} [duration=600] - Durée du cache en secondes. Par défaut : 600s (10 min).
 * @returns {function} Le middleware Express (req, res, next).
 */
const cacheMiddleware = (duration = cache.options.stdTTL) => (req, res, next) => {
  // On ne met en cache que les requêtes GET
  if (req.method !== "GET") {
    return next();
  }

  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`[CACHE] ✅ HIT for ${key}`);
    res.setHeader("Content-Type", "application/json");
    // res.send est assez intelligent pour gérer les objets, les buffers et les chaînes
    res.send(cachedResponse);
    return;
  } else {
    console.log(`[CACHE] 💨 MISS for ${key}`);
    
    const originalSend = res.send;
    res.send = function (body) {
      // On appelle d'abord l'original pour que la réponse soit envoyée au client
      originalSend.call(this, body);

      // On met en cache la réponse uniquement si le statut est un succès
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // On met en cache le 'body' directement. Express s'occupe de la sérialisation.
        // Si c'est un objet, il sera mis en cache comme objet.
        // Si c'est une chaîne (de res.json), il sera mis en cache comme chaîne.
        cache.set(key, body, duration);
      }
      
      // On restaure la fonction send originale pour les appels futurs
      res.send = originalSend;
    };

    next();
  }
};

module.exports = cacheMiddleware;
