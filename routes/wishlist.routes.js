// routes/wishlist.routes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const auth = require('../middleware/auth');

// Ajouter un produit à la wishlist
router.post('/wishlist', auth, wishlistController.addToWishlist);

// Obtenir la wishlist de l'utilisateur
router.get('/wishlist', auth, wishlistController.getWishlist);

// Retirer un produit de la wishlist
router.delete('/wishlist/:productId', auth, wishlistController.removeFromWishlist);

module.exports = router;
