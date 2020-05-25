const express = require('express');
const mongoose = require('mongoose');
const _handlebars = require('handlebars');
const handlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const colors = require('colors');
const Product = require('./models/Product');
const User = require('./models/User');

const {connectionString, localDatabase, options} = require('./db/db');
const port = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));

// View engine setup
app.engine('hbs', handlebars({ 
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(_handlebars)
}));
app.set('view engine', 'hbs');
app.set('views','views');

// Middlewares
app.use(require('./middleware/currentUser'));

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
            res.render('products/products', {
                products
            });
        }) 
        .catch(err => {
            console.log(err);    
        });
});

// Routes
app.use('/admin', require('./routes/adminRoutes'));


app.get('/', (req, res, next) => {
    res.send(`Hello ... this is boutique. This is ${req.user.name} - ${req.user.email}`);
});

app.use((req, res, next) => {
    res.send('404 ... the page your are looking for doesn\'t exist');
});

mongoose.connect(connectionString, options)
    .then(res => {
        return User.findOne();
    })
    .then(user => {
        if(!user) {
            const user = new User({email: 'jora_a@outlook.com', name: 'Jora', surname: 'avanesians', password: 'Hello@world'})    ;
            user.save();
        }
        
        app.listen(port, () => console.log(colors.bgGreen(colors.black(`App is running on http://localhost:${port}`))))
    })
    .catch(err => { 
        console.log(colors.bgRed(`Database failed to connect: ${err} `));
    });