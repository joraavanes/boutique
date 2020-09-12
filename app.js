const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const _handlebars = require('handlebars');
const handlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const {config} = require('dotenv');
const helmet = require('helmet');
const colors = require('colors');

const authorize = require('./middleware/authorize');
require('./utils/lib');

config({ path: './config/config.env'});

const {connectionString, localDatabase, options} = require('./db/db');
const port = process.env.PORT || 3000;

const app = module.exports = express();

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
        },
        getImageAbsolutePath: function(imageUrl){
            if(imageUrl) return imageUrl.substr(6,imageUrl.length).replaceAll('\\', '/');
            
            return imageUrl;
        },
        addCommos: function(price){
            return price.toLocaleString();
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
        path: '/',
        httpOnly: true,
        maxAge: 3600000 * 5 // expires within 5 hours (1800000ms)
    },
    store: sessionStore
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
// app.use(multer({
//         storage: multer.diskStorage({
//             destination: (req, file, callback) => {
//                 callback(null, 'public/userFiles');
//             },
//             filename: (req, file, callback) => {
//                 callback(null, `${new Date().getTime()}-${file.originalname}`);
//             }
//         }),
//         fileFilter: (req, file, callback) => {
//             console.log(file);
//             if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg')
//                 callback(null, true);
//             else
//                 callback(null, false);
//         }
//     })
//     .single('imageUrl'));
// app.use(csrf());
// app.use(require('./middleware/csrfTokens'));
app.use(require('./middleware/currentUser'));
app.use(require('./middleware/checkAuth'));

// Routes
app.use('/admin', authorize, require('./routes/adminRoutes'));
app.use('/shop', authorize, require('./routes/shopRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/admin/userManager', require('./routes/admin/userManagerRoutes'));

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
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });;
});

// app.use('', require('./routes/errorRoutes'));

app.use(require('./controllers/errorController').get404);
app.use(require('./controllers/errorController').getServerError);

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