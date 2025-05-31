const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const auth = require('../middleware/auth');

// Récupérer le panier de l'utilisateur connecté
router.get('/', auth, cartController.getUserCart);

// Ajouter un produit au panier
router.post('/', auth, cartController.addToCart);

// Retirer un produit du panier
router.delete('/:id', auth, cartController.removeFromCart);

module.exports = router;
