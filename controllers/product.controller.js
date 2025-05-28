const db = require('../models');
const Product = db.Product;

// GET /products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du chargement des produits.' });
  }
};

// POST /products/create
exports.createProduct = async (req, res) => {
  const { name, description, quantity, category, symbol, image, gallery, stockThreshold } = req.body;

  try {
    const newProduct = await Product.create({
      name,
      description,
      quantity,
      category,
      symbol,
      image,
      gallery,
      stockThreshold,
    });

    res.status(201).json({ message: 'Produit créé avec succès.', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création du produit.' });
  }
};
