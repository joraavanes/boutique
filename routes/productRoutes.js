const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/:_id', productController.getProduct);

router.get('/', productController.getProducts);

module.exports = router;