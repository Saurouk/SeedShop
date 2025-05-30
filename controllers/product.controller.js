const db       = require('../models');
const Product  = db.Product;
const Category = db.Category;
const { Op }   = require('sequelize');

/* ===== LISTE des produits (recherche / tri / filtre) ===== */
exports.getAllProducts = async (req, res) => {
  try {
    const { sort, category, q } = req.query;

    const where  = {};
    const order  = [];
    const include = {
      model: Category,
      as: 'category',
      attributes: ['id', 'name'],
    };

    /* Recherche mots-clés */
    if (q) {
      where[Op.or] = [
        { name:        { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } }
      ];
    }

    /* Filtre sur nom de catégorie */
    if (category) include.where = { name: category };

    /* Tri prix */
    if (sort === 'price_asc')  order.push(['price', 'ASC']);
    if (sort === 'price_desc') order.push(['price', 'DESC']);

    const products = await Product.findAll({ where, order, include });
    res.status(200).json(products);

  } catch (error) {
    console.error('Erreur récupération produits :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des produits.' });
  }
};

/* ===== CRÉATION produit ===== */
exports.createProduct = async (req, res) => {
  try {
    const {
      name, description, quantity, categoryId, symbol,
      image, gallery, stockThreshold, price,
      isRentable, dailyRate               // ← champs location facultatifs
    } = req.body;

    /* Vérifier la catégorie */
    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ message: 'Catégorie introuvable.' });

    const product = await Product.create({
      name, description, quantity, categoryId, symbol,
      image, gallery, stockThreshold, price,
      isRentable, dailyRate
    });

    res.status(201).json({ message: 'Produit créé avec succès.', product });

  } catch (error) {
    console.error('Erreur création produit :', error);
    res.status(500).json({ message: 'Erreur lors de la création du produit.' });
  }
};

/* ===== MISE À JOUR produit ===== */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable.' });

    /* On applique uniquement les champs envoyés dans le body */
    await product.update(req.body);

    res.status(200).json({ message: 'Produit mis à jour.', product });

  } catch (error) {
    console.error('Erreur mise à jour produit :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit.' });
  }
};
