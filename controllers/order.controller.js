const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Cart = db.Cart;
const Product = db.Product;

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer les items du panier de l'utilisateur
    const cartItems = await Cart.findAll({ where: { userId } });
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Panier vide, impossible de créer la commande." });
    }

    // Calculer le total
    let totalPrice = 0;
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Produit ID ${item.productId} introuvable.` });
      }
      totalPrice += product.price * item.quantity;
    }

    // Créer la commande
    const order = await Order.create({ userId, totalPrice });

    // Créer les orderItems
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    // Vider le panier de l'utilisateur
    await Cart.destroy({ where: { userId } });

    res.status(201).json({ message: 'Commande créée avec succès.', orderId: order.id });
  } catch (error) {
    console.error('Erreur création commande :', error);
    res.status(500).json({ message: "Erreur lors de la création de la commande." });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: {
        model: OrderItem,
        as: 'items',
        include: { model: Product, as: 'product' }
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Erreur récupération commandes :', error);
    res.status(500).json({ message: "Erreur lors de la récupération des commandes." });
  }
};
