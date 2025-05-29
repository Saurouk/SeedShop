const db = require('../models');
const Category = db.Category;

exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const category = await Category.create({ name });
    res.status(201).json({ message: 'Catégorie créée avec succès.', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de la catégorie." });
  }
};
