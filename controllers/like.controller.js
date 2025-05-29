const db = require('../models');
const Like = db.Like;
const Blog = db.Blog;

exports.likeBlog = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    // Vérifier si le blog existe et est publié
    const blog = await Blog.findOne({ where: { id: blogId, published: true } });
    if (!blog) {
      return res.status(404).json({ message: "Article introuvable ou non publié." });
    }

    // Vérifier si l'utilisateur a déjà liké cet article
    const existingLike = await Like.findOne({ where: { userId, blogId } });
    if (existingLike) {
      return res.status(400).json({ message: "Vous avez déjà liké cet article." });
    }

    // Créer le like
    await Like.create({ userId, blogId });

    res.status(201).json({ message: "Article liké avec succès." });
  } catch (error) {
    console.error("Erreur lors du like :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du like." });
  }
};
