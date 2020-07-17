const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.products);

// GET: /admin/products
router.get('/products', adminController.products);

// GET: /admin/new-product
router.get('/products/new-product', adminController.getNewProduct);

// POST: /admin/products/new-product
router.post('/products/new-product', adminController.postNewProduct);

// GET: /admin/products/edit-product
router.get('/products/edit-product/:_id', adminController.getEditProduct);

// POST: /admin/products/edit-product
router.post('/products/edit-product', adminController.postEditProduct);

// POST: /admin/products/delete-product
router.post('/products/delete-product/', adminController.postDeleteProduct);

router.get('/categories/new-category', adminController.getNewCategory);

router.post('/categories/new-category', adminController.postNewCategory);

module.exports = router;