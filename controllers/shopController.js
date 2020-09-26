const path = require('path');
const fs = require('fs');
const {ObjectId} = require('mongodb');
const PdfKit = require('pdfkit');

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

exports.getPdfInvoice = (req, res, next) => {
    const {orderId} = req.params;
    
    Order.findById(orderId)
        .then(order => {

            if(!order) throw new Error('Order does not exist');

            if(order.user.userId.toString() !== req.user._id.toString()){
                throw new Error('You are not authorized to access the file');
            }

            const invoicePath = path.join('userDocs', req.user.email, orderId + '.pdf');
            // fs.readFile(invoicePath, (err, data) => {
            //     if(err) return next(err);

            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', `attachment; filename=${orderId}.pdf`);
            //     res.send(data);
            // });

            const pdfKit = new PdfKit();
            pdfKit.fontSize(18);
            pdfKit.text(`invoice - ${orderId}`);
            pdfKit.moveDown();
            pdfKit.lineCap('butt')
                    .moveTo(60, 90)
                    .lineTo(550, 90)
                    .stroke();

            pdfKit.fontSize(12);
            order.items.forEach((item, i) => {
                pdfKit.text(`${i + 1} - ${item.product.title} - ${item.product.price}`);
            });
            pdfKit.end();

            pdfKit.pipe(fs.createWriteStream(invoicePath));

            // const invoiceStream = fs.createReadStream(invoicePath)

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=${orderId}.pdf`);

            // invoiceStream.pipe(res);
            pdfKit.pipe(res);

        })
        .catch(err => next(err));
};