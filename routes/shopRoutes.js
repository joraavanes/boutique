const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.get('/', shopController.getCart);

router.get('/cart', shopController.getCart);

router.post('/remove-item', shopController.postRemoveItem);

module.exports = router;