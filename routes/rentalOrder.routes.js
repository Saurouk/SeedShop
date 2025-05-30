const express = require('express');
const router = express.Router();
const rentalOrderController = require('../controllers/rentalOrder.controller');
const auth = require('../middleware/auth');

// 🔐 Créer une commande de location (authentification requise)
router.post('/', auth, rentalOrderController.createRentalOrder);

module.exports = router;
