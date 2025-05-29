const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');

// Créer une commande à partir du panier (user connecté)
router.post('/', auth, orderController.createOrder);

// Récupérer toutes les commandes de l'utilisateur connecté
router.get('/', auth, orderController.getUserOrders);

module.exports = router;
