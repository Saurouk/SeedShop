const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const auth = require('../middleware/auth');

// 🔐 Ajouter un commentaire (user connecté)
router.post('/blogs/:id/comments', auth, commentController.addComment);

// ✅ Récupérer les commentaires d’un blog
router.get('/blogs/:id/comments', commentController.getCommentsByBlog);

module.exports = router;
