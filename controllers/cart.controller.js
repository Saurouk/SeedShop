const db = require('../models');
const Cart = db.Cart;
const Product = db.Product;
const Category = db.Category;
const SpecialOffer = db.SpecialOffer;
const { Op } = require('sequelize');

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

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    const existingInOtherCart = await Cart.findOne({
      where: {
        productId,
        userId: { [db.Sequelize.Op.ne]: userId },
      },
    });
    if (existingInOtherCart) {
      return res.status(400).json({ message: 'Produit déjà dans un autre panier.' });
    }

    let cartItem = await Cart.findOne({ where: { productId, userId } });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, productId, quantity });
    }

    // Application d'une offre spéciale si applicable
    const offers = await SpecialOffer.findAll({
      where: {
        active: true,
        startDate: { [Op.lte]: new Date() },
        endDate: { [Op.gte]: new Date() },
      },
      include: {
        model: Product,
        as: 'products',
        where: { id: productId },
      },
    });

    for (const offer of offers) {
      let isEligible = false;

      if (offer.discountType === 'percentage' || offer.discountType === 'fixed') {
        if (!offer.requiredQuantity || cartItem.quantity >= offer.requiredQuantity) {
          isEligible = true;
        }
      } else if (offer.discountType === 'bundle') {
        if (cartItem.quantity >= offer.requiredQuantity) {
          isEligible = true;
        }
      }

      if (isEligible) {
        const price = product.price;
        let discountAmount = 0;

        if (offer.discountType === 'percentage') {
          discountAmount = (price * offer.discountValue / 100) * cartItem.quantity;
        } else if (offer.discountType === 'fixed') {
          discountAmount = offer.discountValue * cartItem.quantity;
        } else if (offer.discountType === 'bundle') {
          discountAmount = 0; 
        }

        cartItem.specialOfferId = offer.id;
        cartItem.discountAmount = discountAmount;
        cartItem.discountedPrice = (price * cartItem.quantity) - discountAmount;
        await cartItem.save();
        break;
      }
    }

    res.status(200).json({ message: cartItem._options.isNewRecord ? 'Produit ajouté au panier.' : 'Quantité mise à jour dans le panier.', cartItem });
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
