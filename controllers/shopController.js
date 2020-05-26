const Product = require('../models/Product');
const User = require('../models/User');
const colors = require('colors');
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

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(() => {
            console.log(req.user.cart.items);

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
        .then(doc => {
            console.log(colors.bgBlue(doc));
            res.redirect('/shop');
        })
        .catch(err => {
            console.log(err);
        });
};