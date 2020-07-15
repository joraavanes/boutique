const express = require('express');
const mongoose = require('mongoose');
const _handlebars = require('handlebars');
const handlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const helmet = require('helmet');
const colors = require('colors');

const User = require('./models/User');
const authorize = require('./middleware/authorize');
// const currentUserMiddleWare = require('./middleware/currentUser');

const {connectionString, localDatabase, options} = require('./db/db');
const checkAuth = require('./middleware/checkAuth');
const port = process.env.PORT || 3000;

const app = express();

// View engine setup
app.engine('hbs', handlebars({ 
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(_handlebars)
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
    secret: 'SUPERSECRETKEY!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1800000 // expires within 30 minutes (1800000ms)
    },
    store: sessionStore
}));
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
    console.log(colors.bgCyan(req.session));
    if(!req.user) return res.render('home/home');

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