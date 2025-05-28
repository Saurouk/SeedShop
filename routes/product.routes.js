const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Route GET /products
router.get('/', productController.getAllProducts);

module.exports = router;
