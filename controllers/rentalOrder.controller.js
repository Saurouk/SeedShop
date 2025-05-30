const db = require('../models');
const RentalOrder = db.RentalOrder;
const Rental = db.Rental;
const Product = db.Product;
const { Op } = require('sequelize');

exports.createRentalOrder = async (req, res) => {
  const userId = req.user.id;
  const items = req.body.items;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Aucun produit à louer.' });
  }

  const t = await db.sequelize.transaction();

  try {
    const order = await RentalOrder.create({ userId }, { transaction: t });

    for (const item of items) {
      const { productId, quantity, startDate, endDate } = item;

      const product = await Product.findByPk(productId);
      if (!product || !product.isRentable) {
        await t.rollback();
        return res.status(400).json({ message: `Produit ID ${productId} non louable.` });
      }

      if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
        await t.rollback();
        return res.status(400).json({ message: `Dates invalides pour le produit ID ${productId}.` });
      }

      const overlapping = await Rental.findAll({
        where: {
          productId,
          status: { [Op.ne]: 'terminée' },
          [Op.and]: [
            { startDate: { [Op.lte]: endDate } },
            { endDate: { [Op.gte]: startDate } }
          ]
        }
      });

      const unitsUsed = overlapping.reduce((acc, rental) => acc + rental.quantity, 0);
      const stockDisponible = product.quantity - unitsUsed;

      if (stockDisponible < quantity) {
        await t.rollback();
        return res.status(409).json({
          message: `Stock insuffisant pour le produit ID ${productId} sur cette période.`
        });
      }

      await Rental.create({
        userId,
        productId,
        quantity,
        startDate,
        endDate,
        orderId: order.id,
        quantityBeforeRental: product.quantity
      }, { transaction: t });
    }

    await t.commit();
    return res.status(201).json({ message: 'Commande de location créée.', orderId: order.id });

  } catch (error) {
    console.error('Erreur création commande de location :', error);
    await t.rollback();
    return res.status(500).json({ message: 'Erreur serveur lors de la commande de location.' });
  }
};
