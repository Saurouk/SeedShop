const db = require('../models');
const SpecialOffer = db.SpecialOffer;
const Product = db.Product;

// 🔐 Créer une offre spéciale
exports.createOffer = async (req, res) => {
  try {
    const {
      title, description, discountType, discountValue,
      requiredQuantity, minPurchase,
      startDate, endDate, productIds
    } = req.body;

    const offer = await SpecialOffer.create({
      title,
      description,
      discountType,
      discountValue,
      requiredQuantity,
      minPurchase,
      startDate,
      endDate,
    });

    if (Array.isArray(productIds) && productIds.length > 0) {
      await offer.setProducts(productIds); // association
    }

    res.status(201).json({ message: "Offre créée avec succès", offer });
  } catch (error) {
    console.error("Erreur création offre spéciale :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Lister toutes les offres actives
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await SpecialOffer.findAll({
      where: { active: true },
      include: {
        model: Product,
        as: 'products',
        attributes: ['id', 'name', 'price'],
      },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(offers);
  } catch (error) {
    console.error("Erreur récupération offres :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔧 Activer / désactiver une offre
exports.toggleOffer = async (req, res) => {
  try {
    const offer = await SpecialOffer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offre introuvable." });

    offer.active = !offer.active;
    await offer.save();

    res.status(200).json({ message: `Offre ${offer.active ? "activée" : "désactivée"}.` });
  } catch (error) {
    console.error("Erreur activation offre :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔗 Ajouter un produit à une offre existante
exports.addProductToOffer = async (req, res) => {
  const offerId = req.params.id;
  const { productId } = req.body;

  try {
    const offer = await SpecialOffer.findByPk(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offre introuvable.' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    await offer.addProduct(product);

    res.status(200).json({ message: 'Produit ajouté à l’offre avec succès.' });
  } catch (error) {
    console.error('Erreur ajout produit à l’offre :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
