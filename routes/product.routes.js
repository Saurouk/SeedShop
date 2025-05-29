const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// 🔓 Route publique : liste des produits (avec tri et recherche)
router.get('/', productController.getAllProducts);

// 🔐 Route protégée : création d’un produit (admin ou superuser)
router.post(
  '/create',
  auth,
  authorize('admin', 'superuser'),
  productController.createProduct
);

module.exports = router;
