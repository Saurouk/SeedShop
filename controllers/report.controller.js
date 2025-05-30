const db = require('../models');
const Report = db.Report;
const Blog = db.Blog;
const Comment = db.Comment;

/* =========================================================================
   Créer un signalement (blog ou commentaire)
   ======================================================================= */
exports.createReport = async (req, res) => {
  const userId = req.user.id;
  const { type, reason } = req.body;
  const blogId = type === 'blog' ? req.params.id : null;
  const commentId = type === 'comment' ? req.params.id : null;

  try {
    if (!type || !reason) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }

    if (!['blog', 'comment'].includes(type)) {
      return res.status(400).json({ message: "Type invalide." });
    }

    // Vérifie que l'entité ciblée existe
    if (type === 'blog') {
      const blog = await Blog.findByPk(blogId);
      if (!blog) return res.status(404).json({ message: "Article introuvable." });
    } else if (type === 'comment') {
      const comment = await Comment.findByPk(commentId);
      if (!comment) return res.status(404).json({ message: "Commentaire introuvable." });
    }

    // Vérifie si un signalement identique existe déjà (éviter les doublons)
    const existingReport = await Report.findOne({
      where: {
        userId,
        type,
        blogId,
        commentId,
        resolved: false,
      },
    });

    if (existingReport) {
      return res.status(409).json({ message: "Signalement déjà envoyé." });
    }

    // Crée le signalement
    const report = await Report.create({
      userId,
      type,
      reason,
      blogId,
      commentId,
      resolved: false,
    });

    res.status(201).json({ message: "Signalement créé avec succès.", report });
  } catch (error) {
    console.error("Erreur création signalement :", error);
    res.status(500).json({ message: "Erreur lors de la création du signalement." });
  }
};

/* =========================================================================
   Lister tous les signalements (admin)
   ======================================================================= */
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: db.User, as: 'reporter', attributes: ['id', 'username'] },
        { model: Blog, as: 'blog', attributes: ['id', 'title'] },
        { model: Comment, as: 'comment', attributes: ['id', 'content'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Erreur récupération signalements :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des signalements." });
  }
};

/* =========================================================================
   Marquer un signalement comme résolu (admin)
   ======================================================================= */
exports.resolveReport = async (req, res) => {
  const reportId = req.params.id;

  try {
    const report = await Report.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ message: "Signalement introuvable." });
    }

    if (report.resolved) {
      return res.status(400).json({ message: "Ce signalement est déjà résolu." });
    }

    report.resolved = true;
    await report.save();

    res.status(200).json({ message: "Signalement marqué comme résolu.", report });
  } catch (error) {
    console.error("Erreur résolution signalement :", error);
    res.status(500).json({ message: "Erreur lors de la résolution du signalement." });
  }
};
