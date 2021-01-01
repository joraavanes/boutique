const {ObjectId} = require('mongodb');
const Product = require('../models/Product');

exports.getProduct = (req, res, next) => {
    const { _id } = req.params;
    
    if(!ObjectId.isValid(_id)){
        const err = new Error();
        err.httpStatusCode = 400;
        throw err;
    }

    Product.findById(_id)
        .select('_id title description price imageUrl')
        .populate('categoryId')
        .then(product => {
            
            if(!product)
                return Promise.reject({httpStatusCode: 404, message: 'Product was not found'});

            res.render('products/product', {product});
        })
        .catch(err => {
            const error = new Error(err.message);
            error.httpStatusCode = err.httpStatusCode || 500;
            return next(error);
        });   
}; 

exports.getProducts = (req, res, next) => {

    Product.find({show: true})
        .populate('categoryId')
        .then(products => {
            
            res.render('products/products', {products});
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};