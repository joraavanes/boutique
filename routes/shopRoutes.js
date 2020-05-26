const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.get('/cart', shopController.getCart);

module.exports = router;