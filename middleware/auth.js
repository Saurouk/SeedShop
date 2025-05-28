const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Lire le token dans l'en-tête Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter les infos du user à la requête
    req.user = decoded;

    next(); // continuer vers la route protégée
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide.' });
  }
};

module.exports = auth;
