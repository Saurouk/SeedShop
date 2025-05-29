const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// 🔐 Créer un article (admin uniquement)
router.post('/', auth, authorize('admin'), blogController.createBlog);

// ✅ Récupérer tous les articles (public)
router.get('/', blogController.getAllBlogs);

module.exports = router;
