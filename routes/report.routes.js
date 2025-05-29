const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Signaler un article
router.post('/blogs/:id/report', auth, reportController.createReport);

// Signaler un commentaire
router.post('/comments/:id/report', auth, reportController.createReport);

// Liste des signalements (admin uniquement)
router.get('/reports', auth, authorize('admin'), reportController.getAllReports);

// Marquer un signalement comme résolu (admin uniquement)
router.patch('/reports/:id/resolve', auth, authorize('admin'), reportController.resolveReport);

module.exports = router;
