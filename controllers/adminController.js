const Product = require('../models/Product');

exports.products = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/products', {
                products
            });
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
    const {title, description, price} = req.body;

    const product = new Product({
        title,
        description,
        price,
        userId: req.user
    });

    product.save()
        .then(() => {
            console.log('product saved.');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
            return res.redirect('/admin/products');
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
            console.log(err);
        });

};

exports.postEditProduct = (req, res, next) => {
    const {_id, title, description, price} = req.body;

    Product.findById(_id)
        .then(product => {
            product.title = title;
            product.description = description;
            product.price = price;

            return product.save();
        })
        .then(result => {
            console.log('Product updated!');
            return res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });

};

exports.postDeleteProduct = (req, res, next) => {
    const {_id} = req.body;

    Product.findByIdAndDelete(_id)
        .then(product => {
            console.log('product deleted');
            return res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};