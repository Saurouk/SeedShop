const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// 🛡 Route protégée : création par admin ou superuser
router.post('/', auth, authorize('admin', 'superuser'), categoryController.createCategory);

module.exports = router;
