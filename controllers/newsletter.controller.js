const db = require('../models');
const Newsletter = db.Newsletter;
const User = db.User;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

// Créer une newsletter
exports.createNewsletter = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newsletter = await Newsletter.create({ title, content });
    res.status(201).json({ message: "Newsletter créée avec succès.", newsletter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur création newsletter." });
  }
};

// Envoyer une newsletter à tous les abonnés
exports.sendNewsletter = async (req, res) => {
  const newsletterId = req.params.id;

  try {
    const newsletter = await Newsletter.findByPk(newsletterId);
    if (!newsletter) return res.status(404).json({ message: "Newsletter introuvable." });
    if (newsletter.sent) return res.status(400).json({ message: "Déjà envoyée." });

    const users = await User.findAll({ where: { newsletterOptIn: true } });

    for (const user of users) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: newsletter.title,
        html: newsletter.content
      });
      console.log(`📧 Newsletter envoyée à ${user.email}`);
    }

    newsletter.sent = true;
    await newsletter.save();

    res.status(200).json({ message: "Newsletter envoyée avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'envoi." });
  }
};

// Récupérer toutes les newsletters (admin)
exports.getAllNewsletters = async (_req, res) => {
  try {
    const newsletters = await Newsletter.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(newsletters);
  } catch (error) {
    console.error("Erreur récupération newsletters :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Mettre à jour la préférence de newsletter (user)
exports.updateNewsletterPreference = async (req, res) => {
  const userId = req.user.id;
  const { newsletterOptIn } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    user.newsletterOptIn = !!newsletterOptIn;
    await user.save();

    res.status(200).json({
      message: `Abonnement à la newsletter ${newsletterOptIn ? 'activé' : 'désactivé'}.`,
      newsletterOptIn: user.newsletterOptIn
    });
  } catch (error) {
    console.error("Erreur mise à jour newsletter :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
