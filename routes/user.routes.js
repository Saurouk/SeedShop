const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

// 🔒 Route protégée par le token
router.get('/profile', auth, (req, res) => {
  res.json({
    message: 'Bienvenue dans ton espace utilisateur !',
    user: req.user, // contient id et role
  });
});

module.exports = router;
