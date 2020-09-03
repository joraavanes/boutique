const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const {ObjectId} = require('mongodb');
const adminController = require('../controllers/adminController');

router.get('/', adminController.dashboard);

// GET: /admin/products
router.get('/dashboard', adminController.dashboard);

// GET: /admin/new-product
router.get('/products/new-product',adminController.getNewProduct);

// POST: /admin/products/new-product
router.post(
    '/products/new-product',
    [
        body('title').notEmpty().withMessage('Please type the product name'),
        body('description').notEmpty().withMessage('Please type description'),
        body('price').notEmpty().toFloat().withMessage('Please enter price')
    ],
    adminController.postNewProduct);

// GET: /admin/products/edit-product
router.get('/products/edit-product/:_id', adminController.getEditProduct);

// POST: /admin/products/edit-product
router.post(
    '/products/edit-product',
    [
        body('_id').custom((value, meta) => {
            if(value == undefined || value == null || value == '') throw new Error('Product id is invalid');
            
            if(!ObjectId.isValid(value)) throw new Error('Product id is invalid');

            return value;
        }),
        body('title').notEmpty().withMessage('Please type the product name'),
        body('description').notEmpty().withMessage('Please type description'),
        body('price').notEmpty().toFloat().withMessage('Please enter price')
    ],
    adminController.postEditProduct);

// POST: /admin/products/delete-product
router.post('/products/delete-product/', adminController.postDeleteProduct);

router.get('/categories/new-category', adminController.getNewCategory);

router.post('/categories/new-category', adminController.postNewCategory);

module.exports = router;