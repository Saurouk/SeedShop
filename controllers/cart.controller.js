const db = require('../models');
const Cart = db.Cart;
const Product = db.Product;
const Category = db.Category;  

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'symbol'],
        include: {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      },
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Erreur récupération panier :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du panier.' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Vérifier que le produit existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    // Vérifier si le produit est déjà dans un autre panier
    const existingInOtherCart = await Cart.findOne({
      where: {
        productId,
        userId: { [db.Sequelize.Op.ne]: userId },
      },
    });
    if (existingInOtherCart) {
      return res.status(400).json({ message: 'Produit déjà dans un autre panier.' });
    }

    // Vérifier si le produit est déjà dans le panier du user
    const existingItem = await Cart.findOne({ where: { productId, userId } });

    if (existingItem) {
      // Mettre à jour la quantité
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json({ message: 'Quantité mise à jour dans le panier.', cartItem: existingItem });
    }

    // Sinon, créer un nouvel item panier
    const cartItem = await Cart.create({ userId, productId, quantity });

    res.status(201).json({ message: 'Produit ajouté au panier.', cartItem });
  } catch (error) {
    console.error('Erreur ajout au panier :', error);
    res.status(500).json({ message: "Erreur lors de l'ajout au panier." });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;

    const cartItem = await Cart.findOne({ where: { id: cartItemId, userId } });

    if (!cartItem) {
      return res.status(404).json({ message: 'Article introuvable dans votre panier.' });
    }

    await cartItem.destroy();

    res.status(200).json({ message: 'Article retiré du panier.' });
  } catch (error) {
    console.error('Erreur suppression du panier :', error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'article du panier." });
  }
};
