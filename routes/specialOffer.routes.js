const express = require('express');
const router = express.Router();
const controller = require('../controllers/specialOffer.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// 🔐 Créer une offre spéciale
router.post('/', auth, authorize('admin', 'superuser'), controller.createOffer);

// ✅ Lister les offres actives
router.get('/', controller.getAllOffers);

// 🔧 Activer / désactiver une offre
router.patch('/:id/toggle', auth, authorize('admin', 'superuser'), controller.toggleOffer);

module.exports = router;
