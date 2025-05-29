const db = require('../models');
const Product = db.Product;
const Category = db.Category;
const { Op } = require('sequelize');

// Obtenir la liste des produits (recherche, tri, filtre par nom de catégorie)
exports.getAllProducts = async (req, res) => {
  try {
    const { sort, category, q } = req.query;

    const where = {};
    const order = [];

    // Recherche dans le nom ou la description
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } }
      ];
    }

    // Tri par prix
    if (sort === 'price_asc') {
      order.push(['price', 'ASC']);
    } else if (sort === 'price_desc') {
      order.push(['price', 'DESC']);
    }

    // Préparation de l'inclusion de la catégorie
    const include = {
      model: Category,
      as: 'category',
      attributes: ['id', 'name'],
    };

    // Si un nom de catégorie est fourni, ajouter une condition
    if (category) {
      include.where = { name: category };
    }

    const products = await Product.findAll({
      where,
      order,
      include
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
      categoryId,
      symbol,
      image,
      gallery,
      stockThreshold,
      price,
    } = req.body;

    // Vérifier si la catégorie existe
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Catégorie introuvable." });
    }

    const product = await Product.create({
      name,
      description,
      quantity,
      categoryId,
      symbol,
      image,
      gallery,
      stockThreshold,
      price,
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
