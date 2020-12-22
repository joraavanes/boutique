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
            
            res.render('products/product', {
                product
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });   
}; 

exports.getProducts = (req, res, next) => {

    Product.find({show: true})
        .populate('categoryId')
        .then(products => {
            console.log(products);
            res.render('products/products', {
                products
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};