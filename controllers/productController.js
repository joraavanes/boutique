const {ObjectId} = require('mongodb');
const Product = require('../models/Product');

exports.getProduct = (req, res, next) => {
    const { _id } = req.params;
    
    if(!ObjectId.isValid(_id)){
        return res.redirect('/products');
    }

    Product.findById(_id)
        .select('_id title description price')
        .populate('categoryId')
        .then(product => {
            // res.send(product);
            // console.log(product);
            res.render('products/product', {
                product
            });
        }).catch((err) => {
            console.log(err);
        });    
}; 

exports.getProducts = (req, res, next) => {

    Product.find()
        .then(products => {
            res.render('products/products', {
                products
            });
        })
        .catch(err => {
            console.log(err);    
        });
};