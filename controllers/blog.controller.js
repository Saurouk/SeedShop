// controllers/blog.controller.js
const db = require('../models');
const Blog = db.Blog;

// Créer un article (admin uniquement)
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

// Récupérer tous les articles (public)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { published: true },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Erreur récupération articles :', error);
    res.status(500).json({ message: "Erreur lors de la récupération des articles." });
  }
};

// Récupérer un article par ID (public)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id: req.params.id,
        published: true
      },
    });

    if (!blog) {
      return res.status(404).json({ message: "Article introuvable ou non publié." });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Erreur détail article :', error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'article." });
  }
};

// Publier un article (admin uniquement)
exports.publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Article introuvable." });
    }

    blog.published = true;
    await blog.save();

    res.status(200).json({ message: "Article publié avec succès.", blog });
  } catch (error) {
    console.error("Erreur publication article :", error);
    res.status(500).json({ message: "Erreur lors de la publication." });
  }
};
