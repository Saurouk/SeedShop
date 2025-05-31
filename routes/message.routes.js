const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth');

// 📩 Envoyer un message (admin ↔ user)
router.post('/', auth, messageController.sendMessage);

// 📥 Récupérer les messages reçus
router.get('/', auth, messageController.getInbox);

// ✅ Marquer comme lu
router.patch('/:id/read', auth, messageController.markAsRead);

module.exports = router;
