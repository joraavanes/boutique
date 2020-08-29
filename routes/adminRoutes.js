const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.dashboard);

// GET: /admin/products
router.get('/dashboard', adminController.dashboard);

// GET: /admin/new-product
router.get(
    '/products/new-product',
    [
        body('title').notEmpty().withMessage('Please type the product name'),
        body('description').notEmpty().withMessage('Please type description'),
        body('price').notEmpty().toFloat().withMessage('Please type description'),
    ],
    adminController.getNewProduct);

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