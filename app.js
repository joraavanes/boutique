const express = require('express');
const mongoose = require('mongoose');
const _handlebars = require('handlebars');
const handlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');
const colors = require('colors');
const Product = require('./models/Product');

const {connectionString, options} = require('./db/db');
const port = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.engine('hbs', handlebars({ 
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(_handlebars)
}));
app.set('view engine', 'hbs');
app.set('views','views');

app.get('/products/:_id', (req, res, next) => {
    const { _id } = req.params;

    Product.findById(_id)
        .then(product => {
            // res.send(product);
            res.render('products/product', {
                product
            });
        }).catch((err) => {
            console.log(err);
        });    
}); 

app.get('/products', (req, res, next) => {
    Product.find()
        .then(products => {
            // res.send(products);
            res.render('products/products', {
                products
            });
        }) 
        .catch(err => {
            console.log(err);    
        });
});

app.get('/admin/products', (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/products', { products });
        })
        .catch(err => {
            console.log(err);    
        });
});

app.get('/admin/products/new-product', (req, res, next) => {
    // res.sendFile(path.join(__dirname, 'views/admin/new-product.html'));
    res.render('admin/new-product');
});

app.post('/admin/products/new-product', (req, res, next) => {
    const {title, description, price} = req.body;
    console.log(title, description, price);

    const product = new Product({title, description, price});

    product.save()
        .then(() => {
            console.log('product saved.');
            res.redirect('/products/new-product');
        });
});

app.get('/admin/products/edit-product/:_id', (req, res, next) => {
    const { _id } = req.params;

    Product.findById(_id)
        .then(product => {
            
            console.log(product);
            res.render('admin/edit-product', {
                pageTitle: 'Edit product ' + product.title,
                product
            });
        })
        .catch((err) => {
            console.log(err);
        });
});       

app.post('/admin/products/edit-product', (req, res, next) => {
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

});

app.post('/admin/products/delete-product', (req, res, next) => {
    const {_id} = req.body;

    Product.findByIdAndDelete(_id)
        .then(product => {
            console.log('product deleted')
            return res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/', (req, res, next) => {
    res.send('Hello ... this is boutique');
});

app.use((req, res, next) => {
    res.send('404 ... the page your are looking for doesn\'t exist');
});

mongoose.connect(connectionString, options)
    .then(res => {
        app.listen(port, () => console.log(colors.bgGreen(colors.black(`App is running on http://localhost:${port}`))))
    })
    .catch(err => { 
        console.log(colors.bgRed(`Database failed to connect: ${err} `));
    });