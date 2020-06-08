const express = require('express');
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');
const _handlebars = require('handlebars');
const handlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const colors = require('colors');
const Product = require('./models/Product');
const User = require('./models/User');
// const currentUserMiddleWare = require('./middleware/currentUser');

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
app.use(session({
    secret: 'SUPERSECRETKEY!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 300000
    }
}));
app.use(require('./middleware/currentUser'));

// Routes
app.use('/admin', require('./routes/adminRoutes'));
app.use('/shop', require('./routes/shopRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/products', require('./routes/productRoutes'));

app.get('/', (req, res, next) => {
    // res.send(`Hello ... this is boutique. This is ${req.user.name} - ${req.user.email}`);
    // console.log(req.session.authenticated);

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(result => {
            
            res.render('home/home', {
                items: req.user.cart.items
            });
        });
});

app.use((req, res, next) => {
    res.send('404 ... the page your are looking for doesn\'t exist');
});

mongoose.Promise = global.Promise;
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