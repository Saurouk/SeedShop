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
    user: req.user,
  });
});

// 🔄 S'abonner / se désabonner de la newsletter
router.put('/newsletter/toggle', auth, userController.toggleNewsletter);

// ❌ Un utilisateur peut supprimer son propre compte (soft delete)
router.delete('/me', auth, userController.softDeleteOwnAccount);

// ❌ Supprimer (désactiver) un utilisateur (soft delete)
router.delete('/:id', auth, userController.softDeleteUser);

// ✅ Réactiver un utilisateur soft-supprimé
router.patch('/:id/restore', auth, userController.restoreUser);

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
      role
    });
    res.status(201).json({ message: "Admin créé", user });
  } catch (error) {
    console.error("Erreur création admin :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
