const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rentalController = require('../controllers/rental.controller');

/**
 * Tous les chemins ici seront préfixés par /rentals
 * via app.use('/rentals', rentalRoutes)
 */

// Créer une location
router.post('/', auth, rentalController.createRental);

// Récupérer toutes les locations de l'utilisateur
router.get('/', auth, rentalController.getUserRentals);

// Récupérer le détail d’une location par ID
router.get('/:id', auth, rentalController.getRentalById);

// Clôturer une location
router.put('/:id/close', auth, rentalController.closeRental);

module.exports = router;
