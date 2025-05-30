// middleware/isAdmin.js
module.exports = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'superuser') {
    return next();
  }
  return res.status(403).json({ message: "Accès réservé aux administrateurs." });
};
