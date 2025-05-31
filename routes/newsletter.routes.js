const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin'); // middleware à ajouter si besoin

// 🔐 Créer une newsletter (admin)
router.post('/', auth, isAdmin, newsletterController.createNewsletter);

// 🔐 Envoyer une newsletter à tous les abonnés (admin)
router.post('/:id/send', auth, isAdmin, newsletterController.sendNewsletter);

// 📩 Récupérer toutes les newsletters (admin)
router.get('/', auth, isAdmin, newsletterController.getAllNewsletters);

// 🔄 Mise à jour de la préférence d’abonnement à la newsletter (user)
router.patch('/subscription', auth, newsletterController.updateNewsletterPreference);

module.exports = router;
