const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// Inscription utilisateur
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Vérifie si l'email est déjà utilisé
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validation du rôle
    const allowedRoles = ['user', 'admin', 'superuser'];
    const assignedRole = allowedRoles.includes(role) ? role : 'user';

    // Création de l'utilisateur
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: assignedRole
    });

    res.status(201).json({ message: "Utilisateur inscrit avec succès.", user });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur pendant l'inscription." });
  }
};

// Connexion utilisateur (inchangé)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
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
