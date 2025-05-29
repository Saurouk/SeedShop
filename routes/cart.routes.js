const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const auth = require('../middleware/auth');

// Récupérer le panier de l'utilisateur connecté
router.get('/cart', auth, cartController.getUserCart);

// Ajouter un produit au panier
router.post('/cart', auth, cartController.addToCart);

// Retirer un produit du panier
router.delete('/cart/:id', auth, cartController.removeFromCart);

module.exports = router;
