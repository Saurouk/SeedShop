const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// 📩 Route publique pour les visiteurs (sans auth)
router.post('/', contactController.sendContactMessage);

module.exports = router;
