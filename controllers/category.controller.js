const db = require('../models');
const Category = db.Category;

// ✅ Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const category = await Category.create({ name });
    res.status(201).json({
      message: 'Catégorie créée avec succès.',
      category,
    });
  } catch (error) {
    console.error('Erreur création catégorie :', error);
    res.status(500).json({ message: "Erreur lors de la création de la catégorie." });
  }
};

// ✅ Récupérer toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur récupération catégories :', error);
    res.status(500).json({ message: "Erreur lors de la récupération des catégories." });
  }
};
