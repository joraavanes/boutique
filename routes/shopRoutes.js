const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

// GET: /shop
router.get('/', shopController.getCart);

// GET: /shop/cart
router.get('/cart', shopController.getCart);

// POST: /shop/add-to-cart
router.post('/add-to-cart', shopController.postAddItem);

// POST: /shop/remove-item
router.post('/remove-item', shopController.postRemoveItem);

// GET: /shop/orders
router.get('/orders', shopController.getOrders);

// POST: /shop/order
router.post('/order', shopController.postOrder);

module.exports = router;