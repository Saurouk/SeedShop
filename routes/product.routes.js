const express = require('express');
const router  = express.Router();
const productController = require('../controllers/product.controller');
const auth      = require('../middleware/auth');
const authorize = require('../middleware/authorize');

/* 🔓 Route publique : liste des produits (recherche, tri, filter) */
router.get('/', productController.getAllProducts);

/* 🔐 Création (admin ou superuser) */
router.post(
  '/create',
  auth,
  authorize('admin', 'superuser'),
  productController.createProduct
);

/* 🔐 Mise à jour d’un produit existant (admin ou superuser) */
router.put(
  '/:id',
  auth,
  authorize('admin', 'superuser'),
  productController.updateProduct
);

/* ❌ Suppression d’un produit (admin ou superuser) */
router.delete(
  '/:id',
  auth,
  authorize('admin', 'superuser'),
  productController.deleteProduct
);

module.exports = router;
