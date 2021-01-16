const express = require('express');
const router = express.Router();
const multer = require('multer');
const csrf = require('csurf');
const {body} = require('express-validator');
const {ObjectId} = require('mongodb');
const adminController = require('../controllers/adminController');

router.get('/', adminController.dashboard);

// GET: /admin/products
router.get('/dashboard', adminController.dashboard);

// GET: /admin/new-product
router.get('/products/new-product',
            csrf(),
            require('../middleware/csrfTokens'),
            adminController.getNewProduct);

// POST: /admin/products/new-product
router.post(
    '/products/new-product',
    multer({
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                    callback(null, 'public/user-files');
            },
            filename: (req, file, callback) => {
                    callback(null, `${new Date().getTime()}-${file.originalname}`);
            },
            fileFilter: (req, file, callback) => {
                if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg')
                    callback(null, true);
                else
                    callback(null, false);
            },
        })
    }).single('imageUrl'),
    csrf(),
    require('../middleware/csrfTokens'),
    [
        body('title').notEmpty().withMessage('Please type the product title'),
        body('title').isLength({min: 5, max: 25}).withMessage('Title should be between 5 and 25 characters length'),
        body('description').notEmpty().withMessage('Please type description'),
        body('description').isLength({min: 5}).withMessage('Description should be atleast 5 characters'),
        body('price').notEmpty().toFloat().withMessage('Please enter price')
    ],
    adminController.postNewProduct
);

// GET: /admin/products/edit-product
router.get('/products/edit-product/:_id',
            csrf(),
            require('../middleware/csrfTokens'),
            adminController.getEditProduct);

// POST: /admin/products/edit-product
router.post(
    '/products/edit-product',
    multer({
            storage: multer.diskStorage({
            destination: (req, file, callback) => {
                    callback(null, 'public/user-files');
            },
            filename: (req, file, callback) => {
                    callback(null, `${new Date().getTime()}-${file.originalname}`);
            },
            fileFilter: (req, file, callback) => {
                if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg')
                    callback(null, true);
                else
                    callback(null, false);
            },
        })
    }).single('imageUrl'),
    csrf(),
    require('../middleware/csrfTokens'),
    [
        body('_id').custom((value, meta) => {
            if(value == undefined || value == null || value == '') throw new Error('Product id is invalid');
            
            if(!ObjectId.isValid(value)) throw new Error('Product id is invalid');

            return value;
        }),
        body('title').notEmpty().isLength({min: 5, max: 25}).withMessage('Please type the product name, minimum of 5 chars'),
        body('description').notEmpty().isLength({min: 5}).withMessage('Please type description'),
        body('price').notEmpty().toFloat().withMessage('Please enter price')
    ],
    adminController.postEditProduct
);

// DELETE: /admin/products/delete-product
router.delete('/products/delete-product/', adminController.deleteProduct);

// GET: /admin/categoryManager
router.get('/categoryManager/', adminController.getCategories);

// GET: /admin/categoryManager/new-category
router.get('/categoryManager/new-category', adminController.getNewCategory);

// POST: /admin/categoryManager/new-category
router.post('/categoryManager/new-category', adminController.postNewCategory);

module.exports = router;