const Product = require('../models/Product');
const Category = require('../models/Category');

exports.dashboard = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/dashboard', {
                products,
                barChartData: [12, 19, 3, 5, 2, 3]
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
    const {title, description, price, show} = req.body;

    const product = new Product({
        title,
        description,
        price,
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
    const {_id, title, description, price, show} = req.body;

    Product.findById(_id)
        .then(product => {
            product.title = title;
            product.description = description;
            product.price = price;
            product.show = show === 'on' ? true : false;

            return product.save();
        })
        .then(result => {
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