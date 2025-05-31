const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// Inscription utilisateur
exports.register = async (req, res) => {
  const { username, email, password, role, newsletterOptIn } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const allowedRoles = ['user', 'admin', 'superuser'];
    const assignedRole = allowedRoles.includes(role) ? role : 'user';

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: assignedRole,
      newsletterOptIn: !!newsletterOptIn
    });

    res.status(201).json({ message: "Utilisateur inscrit avec succès.", user });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur pendant l'inscription." });
  }
};

// Connexion utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email, deletedAt: null } });
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error("Erreur lors du login :", error);
    res.status(500).json({ message: "Erreur serveur pendant la connexion." });
  }
};

// 🔄 Mise à jour des préférences de newsletter
exports.toggleNewsletter = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    user.newsletterOptIn = !user.newsletterOptIn;
    await user.save();

    res.status(200).json({
      message: user.newsletterOptIn
        ? "Inscription à la newsletter confirmée."
        : "Désinscription de la newsletter effectuée.",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la newsletter :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ❌ Soft delete utilisateur
exports.softDeleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    await user.destroy();
    res.status(200).json({ message: "Utilisateur désactivé (soft delete)." });
  } catch (error) {
    console.error("Erreur soft delete :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Réactiver un utilisateur soft-deleted
exports.restoreUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const restored = await User.restore({ where: { id: userId } });
    if (restored === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé ou déjà actif." });
    }

    res.status(200).json({ message: "Utilisateur réactivé avec succès." });
  } catch (error) {
    console.error("Erreur restauration utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
