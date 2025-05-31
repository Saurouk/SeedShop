const db       = require('../models');
const Product  = db.Product;
const Category = db.Category;
const Message  = db.Message;
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
      isRentable, dailyRate
    } = req.body;

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

    await product.update(req.body);

    if (product.quantity <= product.stockThreshold) {
      const admin = await db.User.findOne({ where: { role: 'admin' } });
      if (admin) {
        const subject = product.quantity === 0
          ? `⚠️ Rupture de stock : ${product.name}`
          : `⚠️ Stock bas : ${product.name}`;

        const content = `
          Le produit <strong>${product.name}</strong> a atteint un seuil critique :
          <ul>
            <li>Quantité actuelle : <strong>${product.quantity}</strong></li>
            <li>Seuil critique défini : ${product.stockThreshold}</li>
          </ul>
          Merci de réapprovisionner ce produit.`;

        await Message.create({
          senderId: null,
          receiverId: admin.id,
          subject,
          content,
        });
      }
    }

    res.status(200).json({ message: 'Produit mis à jour.', product });

  } catch (error) {
    console.error('Erreur mise à jour produit :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit.' });
  }
};

/* ===== SUPPRESSION produit ===== */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable.' });

    await product.destroy();
    res.status(200).json({ message: 'Produit supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur suppression produit :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du produit.' });
  }
};
