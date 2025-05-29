const db = require('../models');
const Blog = db.Blog;
const { Op } = require('sequelize');

// ✅ Créer un article (admin uniquement)
exports.createBlog = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const blog = await Blog.create({
      title,
      content,
      category,
      authorId: req.user.id,
    });

    res.status(201).json({ message: 'Article créé avec succès.', blog });
  } catch (error) {
    console.error('Erreur création article :', error);
    res.status(500).json({ message: "Erreur lors de la création de l'article." });
  }
};

// ✅ Récupérer tous les articles (public)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Erreur récupération articles :', error);
    res.status(500).json({ message: "Erreur lors de la récupération des articles." });
  }
};
