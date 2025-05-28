const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// 🔐 Authentification
router.post('/register', userController.register);
router.post('/login', userController.login);

// 🔒 Espace utilisateur protégé
router.get('/profile', auth, (req, res) => {
  res.json({
    message: 'Bienvenue dans ton espace utilisateur !',
    user: req.user, // contient id et role
  });
});

// 🔧 Route TEMPORAIRE pour créer un admin/superuser
const db = require('../models');
const bcrypt = require('bcrypt');
router.post('/create-admin', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'admin', // 'admin' ou 'superuser'
    });

    res.status(201).json({ message: 'Compte admin créé avec succès.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création de l'admin." });
  }
});

module.exports = router;
