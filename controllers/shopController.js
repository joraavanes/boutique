const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(() => {

            res.render('shop/cart', {
                items: req.user.cart.items
            });
        })
        .catch(err => console.log(err));
};

exports.postAddItem = (req, res, next) => {
    const { productId, quantity } = req.body;

    Product.findById(productId)
        .then(product => req.user.addToCart(product, quantity))
        .then(doc => res.redirect('/shop/cart'))
        .catch(err => console.log(err));
};

exports.postRemoveItem = (req, res, next) => {
    const {itemId} = req.body

    req.user
        .removeItem(itemId)
        .then(user => {

            return res.redirect('/shop/cart');
        })
        .catch((err) => {
            
        });
};

exports.getOrders = (req, res, next) => {

    Order.find()
        .sort({ issuedDate: -1 })
        .then(orders => {
            res.render('shop/orders', { orders });
        })
        .catch(err => {
            console.log(err);
        });
};

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

            res.status(400).redirect('/shop/orders');
        });
};