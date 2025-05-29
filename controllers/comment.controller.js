const db = require('../models');
const Comment = db.Comment;
const Blog = db.Blog;

// 🔘 Ajouter un commentaire à un article
exports.addComment = async (req, res) => {
  const blogId = req.params.id;
  const { content } = req.body;

  try {
    // Vérifier que l'article existe et est publié
    const blog = await Blog.findOne({
      where: { id: blogId, published: true }
    });
    if (!blog) {
      return res.status(404).json({ message: "Article introuvable ou non publié." });
    }

    const comment = await Comment.create({
      content,
      blogId: blog.id,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Commentaire ajouté avec succès.",
      comment
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du commentaire." });
  }
};

// 🔘 Lister les commentaires d'un article
exports.getCommentsByBlog = async (req, res) => {
  const blogId = req.params.id;

  try {
    const comments = await Comment.findAll({
      where: { blogId },
      include: {
        model: db.User,
        as: 'user',
        attributes: ['id', 'username']
      },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des commentaires." });
  }
};
