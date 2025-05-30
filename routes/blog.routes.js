const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// 🔐 Créer un article (admin uniquement)
router.post('/', auth, authorize('admin'), blogController.createBlog);

// ✅ Récupérer tous les articles (public)
router.get('/', blogController.getAllBlogs);

// ✅ Lire un article en détail (public)
router.get('/:id', blogController.getBlogById);

// 🔐 Publier un article (admin uniquement)
router.patch('/:id/publish', auth, authorize('admin'), blogController.publishBlog);

// 🔐 Modifier un article (admin uniquement)
router.put('/:id', auth, authorize('admin'), blogController.updateBlog);

// 🔐 Supprimer un article (admin uniquement)
router.delete('/:id', auth, authorize('admin'), blogController.deleteBlog);

module.exports = router;
