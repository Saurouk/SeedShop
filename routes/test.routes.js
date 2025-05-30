const express = require('express');
const router = express.Router();
const reminderNotifier = require('../cron/reminderNotifier'); // ✅ Corrigé

// 🔁 Route de test manuelle pour envoyer les mails de rappel
router.get('/test-reminder', async (_req, res) => {
  try {
    await reminderNotifier.notifyUpcomingRentals(); // ✅ Corrigé ici aussi
    res.status(200).json({ message: "Notifications envoyées avec succès." });
  } catch (error) {
    console.error("Erreur envoi notifications test :", error);
    res.status(500).json({ message: "Erreur envoi notifications." });
  }
});

module.exports = router;
