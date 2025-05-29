const db = require('../models');
const Product = db.Product;
const { Op } = require('sequelize');

// Obtenir la liste des produits (avec recherche et tri)
exports.getAllProducts = async (req, res) => {
  try {
    const { sort, category, q } = req.query;

    const where = {};
    const order = [];

    // Recherche par mot-clé dans le nom ou la description
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } }
      ];
    }

    // Filtrage par catégorie (exact match)
    if (category) {
      where.category = category;
    }

    // Tri par prix
    if (sort === 'price_asc') {
      order.push(['price', 'ASC']);
    } else if (sort === 'price_desc') {
      order.push(['price', 'DESC']);
    }

    const products = await Product.findAll({
      where,
      order,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des produits." });
  }
};

// Création de produit (admin/superuser uniquement)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      quantity,
      category,
      symbol,
      image,
      gallery,
      stockThreshold
    } = req.body;

    const product = await Product.create({
      name,
      description,
      quantity,
      category,
      symbol,
      image,
      gallery,
      stockThreshold
    });

    res.status(201).json({
      message: 'Produit créé avec succès.',
      product
    });
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error);
    res.status(500).json({ message: "Erreur lors de la création du produit." });
  }
};
