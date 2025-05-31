const PDFDocument = require('pdfkit');
const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Cart = db.Cart;
const Product = db.Product;
const SpecialOffer = db.SpecialOffer;
// 📝 Modification mineure pour forcer un nouveau commit

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({ where: { userId } });
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Panier vide, impossible de créer la commande." });
    }

    let totalPrice = 0;
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId, {
        include: { model: SpecialOffer, as: 'specialOffers', through: { attributes: [] } },
      });

      if (!product) {
        return res.status(400).json({ message: `Produit ID ${item.productId} introuvable.` });
      }

      let baseSubtotal = product.price * item.quantity;
      let discount = 0;

      for (const offer of product.specialOffers || []) {
        const now = new Date();
        const isActive = offer.active && (!offer.startDate || offer.startDate <= now) && (!offer.endDate || offer.endDate >= now);

        if (!isActive) continue;

        if (offer.discountType === 'percentage' && item.quantity >= offer.requiredQuantity) {
          discount = Math.max(discount, (offer.discountValue / 100) * baseSubtotal);
        } else if ((offer.discountType === 'fixed' || offer.discountType === 'bundle') && item.quantity >= offer.requiredQuantity) {
          discount = Math.max(discount, offer.discountValue);
        }
      }

      const subtotalAfterDiscount = baseSubtotal - discount;
      totalPrice += subtotalAfterDiscount;
    }

    const order = await Order.create({ userId, totalPrice });

    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

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

exports.downloadInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: {
        model: OrderItem,
        as: 'items',
        include: { model: Product, as: 'product' }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Disposition', `attachment; filename=Facture_Commande_${orderId}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Facture de commande', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Commande n°: ${order.id}`);
    doc.text(`Date: ${order.createdAt.toLocaleDateString()}`);
    doc.text(`Statut: ${order.status}`);
    doc.text(`Client ID: ${order.userId}`);
    doc.moveDown();

    doc.text('Produits :');
    order.items.forEach(item => {
      doc.text(`- ${item.product.name} x${item.quantity} @ ${item.priceAtPurchase.toFixed(2)} € = ${(item.priceAtPurchase * item.quantity).toFixed(2)} €`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total : ${order.totalPrice.toFixed(2)} €`, { align: 'right' });

    doc.end();
  } catch (error) {
    console.error('Erreur génération facture :', error);
    res.status(500).json({ message: 'Erreur lors de la génération de la facture.' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({ where: { id: orderId, userId } });

    if (!order) {
      return res.status(404).json({ message: "Commande introuvable." });
    }

    const allowedStatuses = ['en attente', 'confirmée', 'préparation'];
    if (!allowedStatuses.includes(order.status)) {
      return res.status(400).json({ message: "Commande non annulable à ce stade." });
    }

    order.status = 'annulée';
    await order.save();

    res.status(200).json({ message: "Commande annulée avec succès.", order });
  } catch (error) {
    console.error('Erreur annulation commande :', error);
    res.status(500).json({ message: "Erreur lors de l'annulation de la commande." });
  }
};

exports.previewOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: {
        model: Product,
        as: 'product',
        include: {
          model: SpecialOffer,
          as: 'specialOffers',
          through: { attributes: [] },
        },
      },
    });

    let totalBeforeDiscount = 0;
    let totalDiscount = 0;

    const detailedItems = [];

    for (const item of cartItems) {
      const { product, quantity } = item;
      const unitPrice = product.price;
      const baseSubtotal = quantity * unitPrice;

      let bestDiscount = 0;

      for (const offer of product.specialOffers || []) {
        const now = new Date();

        const isActive =
          offer.active &&
          (!offer.startDate || offer.startDate <= now) &&
          (!offer.endDate || offer.endDate >= now);

        if (!isActive) continue;

        if (offer.discountType === 'percentage' && quantity >= offer.requiredQuantity) {
          bestDiscount = Math.max(bestDiscount, (offer.discountValue / 100) * baseSubtotal);
        } else if ((offer.discountType === 'fixed' || offer.discountType === 'bundle') && quantity >= offer.requiredQuantity) {
          bestDiscount = Math.max(bestDiscount, offer.discountValue);
        }
      }

      const subtotalAfterDiscount = baseSubtotal - bestDiscount;

      totalBeforeDiscount += baseSubtotal;
      totalDiscount += bestDiscount;

      detailedItems.push({
        productId: product.id,
        name: product.name,
        unitPrice,
        quantity,
        subtotal: baseSubtotal,
        discount: bestDiscount,
        total: subtotalAfterDiscount,
      });
    }

    const totalAfterDiscount = totalBeforeDiscount - totalDiscount;

    res.status(200).json({
      items: detailedItems,
      totalBeforeDiscount,
      totalDiscount,
      totalAfterDiscount,
    });
  } catch (error) {
    console.error("Erreur prévisualisation commande :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
