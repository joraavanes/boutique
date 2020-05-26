const Product = require('../models/Product');
const User = require('../models/User');
const colors = require('colors');

exports.getCart = (req, res, next) => {
    
    res.render('shop/cart', {
        items: req.user.cart.items
    });
};

exports.postRemoveItem = (req, res, next) => {
    const {itemId} = req.body

    req.user
        .removeItem(itemId)
        .then(user => {
            console.log(colors.bgBlue(user));

            return res.redirect('/shop/cart');
        })
        .catch((err) => {
            
        });
};

