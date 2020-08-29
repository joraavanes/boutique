const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const _handlebars = require('handlebars');
const handlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const {config} = require('dotenv');
const helmet = require('helmet');
const colors = require('colors');

const authorize = require('./middleware/authorize');

config({ path: './config/config.env'});

const {connectionString, localDatabase, options} = require('./db/db');
const port = process.env.PORT || 3000;

const app = express();

// View engine setup
app.engine('hbs', handlebars({
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(_handlebars),
    helpers:{
        formatDate: function(value){
            return new Date(value).toLocaleDateString();
        },
        formatIndex: function(value){
            return value + 1;
        },
        errorFieldClassname: function(value, field){
            if(value === undefined || value === null) return '';

            var errorField = value.find(x => x.param == field);
            return errorField !== undefined ? 'is-invalid' : '';
        },
        activeMenuItem: function(viewName, currentView){
            return viewName === currentView ? 'active' : '';
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views','views');

// Middlewares
app.use(express.urlencoded({ extended: true }));

const sessionStore = new SessionStore({
    uri: connectionString,
    collection: 'user_sessions'
});

app.use(session({
    name: 'user.session',
    secret: 'SUPERSECRETKEY!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 * 5 // expires within 5 hours (1800000ms)
    },
    store: sessionStore
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(csrf());
app.use(require('./middleware/csrfTokens'));

app.use(require('./middleware/currentUser'));
app.use(require('./middleware/checkAuth'));

// Routes
app.use('/admin', authorize, require('./routes/adminRoutes'));
app.use('/shop', authorize, require('./routes/shopRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/products', require('./routes/productRoutes'));

app.get('/', (req, res, next) => {
    console.log(colors.cyan(req.session));
    if(!req.user) return res.render('home/home');

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(result => {
            
            res.render('home/home', {
                pageTitle: 'Boutique',
                items: req.user.cart.items
            });
        });
});

app.use((req, res, next) => {
    res.send('404 ... the page your are looking for doesn\'t exist');
});

mongoose.Promise = global.Promise;
mongoose.connect(connectionString, options)
    .then(user => {
        // if(!user) {
        //     const user = new User({email: 'jora_a@outlook.com', name: 'Jora', surname: 'avanesians', password: 'Hello@world'})    ;
        //     user.save();
        // }
        
        app.listen(port, () => console.log(colors.bgGreen(`App is running on http://localhost:${port}`)));
    })
    .catch(err => { 
        console.log(colors.bgRed(`Database failed to connect: ${err} `));
    });