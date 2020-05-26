const Product = require('../models/Product');
const User = require('../models/User');

exports.getCart = (req, res, next) => {
    
    res.render('shop/cart', {
        items: req.user.cart.items
    });
};

