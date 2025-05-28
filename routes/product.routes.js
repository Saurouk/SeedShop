const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Route publique : voir les produits
router.get('/', productController.getAllProducts);

// Route protégée : créer un produit (admin ou superuser)
router.post('/create', auth, authorize('admin', 'superuser'), productController.createProduct);

module.exports = router;
