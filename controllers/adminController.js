const {validationResult} = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

exports.dashboard = (req, res, next) => {
    let model = {};

    Product.find()
        .limit(10)
        .sort({issuedDate: -1})
        .then(products => {
            model = {
                products,
                barChartData: [12, 19, 3, 5, 2, 3]
            };
            return User.find();
        })
        .then(users => {
            model.users = users;

            res.render('admin/dashboard', model);
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getNewProduct = (req, res, next) => {
    // res.sendFile(path.join(__dirname, 'views/admin/new-product.html'));
    res.render('admin/new-product');
};

exports.postNewProduct = (req, res, next) => {
    const {title, description, price, show} = req.body;
    const image = req.file;

    const errors = validationResult(req);
    const errorsList = errors.array();

    if(!image){
        errorsList.push({param: 'imageUrl', msg: 'Please upload product image'});
    }

    if(errorsList.length != 0){
        return res.render('admin/new-product', {
            errMessages: errorsList,
            title,
            description,
            price: price ? price : undefined,
            show: show === 'on' ? 'checked' : ''
        });
    }

    const product = new Product({
        title,
        description,
        price,
        imageUrl: image.path, 
        issuedDate: new Date().valueOf(),
        show: show === 'on'? true : false,
        userId: req.user
    });

    Category.findOne()
        .then(category => {
            product.categoryId = category;
            return product.save()
        })
        .then(doc => {
            res.redirect('/admin/dashboard');
        })
        .catch(err => {
            console.log(err);
            return res.redirect('/admin/dashboard');
        });
};

exports.getEditProduct = (req, res, next) => {
    const { _id } = req.params;

    Product.findById(_id)
        .then(product => {
            
            res.render('admin/edit-product', {
                pageTitle: 'Edit product ' + product.title,
                product
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postEditProduct = (req, res, next) => {
    const {_id, title, description, price, show, issuedDate} = req.body;
    const image = req.file;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('admin/edit-product', {
            errMessages: errors.array(),
            product: {
                _id,
                title,
                description,
                price: price ? price : undefined,
                show: show === 'on' ? true : false,
                issuedDate}
        });
    }

    Product.findById(_id)
        .then(product => {
            product.title = title;
            product.description = description;
            if(image){
                product.imageUrl = image.path;
            }
            product.price = price;
            product.issuedDate = issuedDate ? issuedDate : new Date().getTime(),
            product.show = show === 'on' ? true : false;

            return product.save();
        })
        .then(result => {
            return res.redirect('/admin/dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postDeleteProduct = (req, res, next) => {
    const {_id} = req.body;

    Product.findByIdAndDelete(_id)
        .then(product => {
            return res.redirect('/admin/dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getNewCategory = (req, res, next) => {
    res.render('admin/new-category', {});
};

exports.postNewCategory = (req, res, next) => {
    const {title} = req.body;

    const category = new Category({ title });

    category.save()
        .then(doc => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin/products');
        });
};