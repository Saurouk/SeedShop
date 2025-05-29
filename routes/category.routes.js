const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// 🔐 Création d'une catégorie (admin ou superuser uniquement)
router.post('/', auth, authorize('admin', 'superuser'), categoryController.createCategory);

// ✅ Récupération de toutes les catégories (route publique)
router.get('/', categoryController.getAllCategories);

module.exports = router;
