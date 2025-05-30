const express = require('express');
const router = express.Router();
const rentalOrderController = require('../controllers/rentalOrder.controller');
const auth = require('../middleware/auth');

// 🔐 Créer une commande de location (authentification requise)
router.post('/', auth, rentalOrderController.createRentalOrder);

// 🔐 Clôturer une commande de location groupée
router.put('/:id/close', auth, rentalOrderController.closeRentalOrder);

// 🔐 Détail d’une commande de location
router.get('/:id', auth, rentalOrderController.getRentalOrderById);

module.exports = router;
