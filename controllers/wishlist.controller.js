// controllers/wishlist.controller.js
const db = require('../models');
const Wishlist = db.Wishlist;
const Product = db.Product;

/**
 * POST /wishlist
 * Ajoute un produit à la liste de souhait de l'utilisateur connecté
 * Body : { productId }
 */
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Vérifier que le produit existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    // Créer ou récupérer l'enregistrement (évite les doublons)
    const [item, created] = await Wishlist.findOrCreate({
      where: { userId, productId },
    });

    if (!created) {
      return res.status(200).json({ message: 'Produit déjà dans la wishlist.' });
    }

    res.status(201).json({ message: 'Produit ajouté à la wishlist.' });
  } catch (error) {
    console.error('Erreur ajout wishlist :', error);
    res.status(500).json({ message: "Erreur lors de l'ajout à la wishlist." });
  }
};

/**
 * GET /wishlist
 * Retourne tous les produits de la wishlist de l'utilisateur connecté
 */
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Wishlist.findAll({
      where: { userId },
      include: {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'symbol'],
      },
    });

    res.status(200).json(items);
  } catch (error) {
    console.error('Erreur récupération wishlist :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la wishlist.' });
  }
};

/**
 * DELETE /wishlist/:productId
 * Supprime un produit de la wishlist de l'utilisateur connecté
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const item = await Wishlist.findOne({ where: { userId, productId } });

    if (!item) {
      return res.status(404).json({ message: 'Produit introuvable dans votre wishlist.' });
    }

    await item.destroy();
    res.status(200).json({ message: 'Produit retiré de la wishlist.' });
  } catch (error) {
    console.error('Erreur suppression wishlist :', error);
    res.status(500).json({ message: "Erreur lors de la suppression de la wishlist." });
  }
};
