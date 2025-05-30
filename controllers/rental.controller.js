const { Op } = require('sequelize');
const db      = require('../models');
const Rental  = db.Rental;
const Product = db.Product;

/* =========================================================================
   1.  Créer une location  – POST /rentals          (user connecté)
   ======================================================================= */
exports.createRental = async (req, res) => {
  try {
    const { productId, startDate, endDate } = req.body;
    const userId = req.user.id;

    /* ─── 1-a  Vérifier le produit et qu’il est louable ─────────────────── */
    const product = await Product.findByPk(productId);
    if (!product || !product.isRentable) {
      return res.status(400).json({ message: 'Produit non louable ou introuvable.' });
    }

    /* ─── 1-b  Vérifier la cohérence des dates ──────────────────────────── */
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ message: 'Dates invalides.' });
    }

    /* ─── 1-c  Vérifier le chevauchement sur la table Rental (pas Product) ─ */
    const overlap = await Rental.findOne({
      where: {
        productId,
        status: { [Op.ne]: 'terminée' },
        [Op.and]: [
          { startDate: { [Op.lte]: endDate   } },
          { endDate:   { [Op.gte]: startDate } },
        ],
      },
    });
    if (overlap) {
      return res.status(409).json({ message: 'Produit déjà loué sur cette période.' });
    }

    /* ─── 1-d  Créer la location ────────────────────────────────────────── */
    const rental = await Rental.create({ userId, productId, startDate, endDate });

    res.status(201).json({ message: 'Location créée.', rental });
  } catch (error) {
    console.error('Erreur création location :', error);
    res.status(500).json({ message: 'Erreur lors de la création de la location.' });
  }
};

/* =========================================================================
   2.  Liste des locations de l’utilisateur – GET /rentals   (user connecté)
   ======================================================================= */
exports.getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.findAll({
      where: { userId: req.user.id },
      include: {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'dailyRate'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(rentals);
  } catch (err) {
    console.error('Erreur récupération locations :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des locations.' });
  }
};

/* =========================================================================
   3.  Détail d’une location – GET /rentals/:id        (user connecté)
   ======================================================================= */
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'dailyRate'],
      },
    });

    if (!rental) return res.status(404).json({ message: 'Location introuvable.' });
    res.status(200).json(rental);
  } catch (err) {
    console.error('Erreur détail location :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération de la location.' });
  }
};

/* =========================================================================
   4.  Clôturer / rendre le produit – PUT /rentals/:id/close (user connecté)
   ======================================================================= */
exports.closeRental = async (req, res) => {
  try {
    const rental = await Rental.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'dailyRate'],
      },
    });
    if (!rental)  return res.status(404).json({ message: 'Location introuvable.' });
    if (rental.status === 'terminée') {
      return res.status(400).json({ message: 'Location déjà terminée.' });
    }

    /* ─── Calcul du retard éventuel ────────────────────────────────────── */
    const today    = new Date();
    const endDate  = new Date(rental.endDate);
    const msInDay  = 1000 * 60 * 60 * 24;
    const lateDays = Math.max(0, Math.ceil((today - endDate) / msInDay));

    if (lateDays > 0) {
      const coef = parseFloat(process.env.LATE_FEE_MULTIPLIER || 1.5);
      rental.lateFee = lateDays * rental.product.dailyRate * coef;
      rental.status  = 'retard';
    } else {
      rental.status  = 'terminée';
    }

    await rental.save();
    res.status(200).json({ message: 'Location clôturée.', rental });
  } catch (err) {
    console.error('Erreur clôture location :', err);
    res.status(500).json({ message: 'Erreur lors de la clôture de la location.' });
  }
};
