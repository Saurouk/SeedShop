const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth');

// 📩 Envoyer un message (admin ↔ user)
router.post('/', auth, messageController.sendMessage);

// 📥 Récupérer les messages reçus
router.get('/', auth, messageController.getInbox);

// 🔍 Lire un message précis (et le marquer comme lu)
router.get('/:id', auth, messageController.getMessageById);

// ✅ Marquer comme lu
router.patch('/:id/read', auth, messageController.markAsRead);

// 💬 Répondre à un message existant
router.post('/:id/reply', auth, messageController.replyToMessage);

module.exports = router;
