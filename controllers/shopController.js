const {ObjectId} = require('mongodb');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// GET: /shop
// GET: /shop/cart
exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(() => {

            res.render('shop/cart', {
                items: req.user.cart.items
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// POST: /shop/add-to-cart
exports.postAddItem = (req, res, next) => {
    const { productId, quantity } = req.body;

    Product.findById(productId)
        .then(product => req.user.addToCart(product, quantity))
        .then(doc => res.redirect('/shop/cart'))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// POST: /shop/remove-item
exports.postRemoveItem = (req, res, next) => {
    const {itemId} = req.body

    req.user
        .removeItem(itemId)
        .then(user => {
            return res.redirect('/shop/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET: /shop/orders
exports.getOrders = (req, res, next) => {

    Order.find({ 'user.userId': ObjectId(req.user._id.toString()) })
        .sort({ issuedDate: -1 })
        .then(orders => {
            res.render('shop/orders', { orders });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// POST: /shop/order
exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(() => {

            if(req.user.cart.items.length === 0){
                return Promise.reject('cart empty');
            }

            const items = req.user.cart.items.map(item => ({
                quantity: item.quantity,
                product: {...item.productId._doc}
            }));

            const order = new Order({
                user:{
                    name: req.user.name,
                    userId: req.user
                },
                items
            });

            return order.save();
        })
        .then(doc => req.user.clearItems())
        .then(user=> res.redirect('/shop/orders'))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};