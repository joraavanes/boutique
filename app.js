const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const _handlebars = require('handlebars');
const handlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const morgan = require('morgan');
const {config} = require('dotenv');
const helmet = require('helmet');
const colors = require('colors');

const authenticate = require('./middleware/authenticate');
require('./utils/lib');

config({ path: './config/config.env'});

const {connectionString, localDatabase, options} = require('./db/db');
const port = process.env.PORT || 3000;

const app = module.exports = express();

// custom token to add error message to log
morgan.token('errorMessage', function(req, res){ return req.errorMessage; })

// print out logs only with 4xx and 5xx responses to console
app.use(morgan(':method :url :status Error::errorMessage', {
    skip: function ( req, res) { return res.statusCode < 400;}
}));

// write 4xx and 5xx logs to access.log file
app.use(morgan(':method :url :status Error::errorMessage', {
    skip: function (req, res) { return res.statusCode < 400; },
    stream: require('fs').createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
}));

// View engine setup
app.engine('hbs', handlebars({
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(_handlebars),
    helpers:{
        compare: function(value1, value2){
            return value1.toString() == value2.toString() ? 'selected' : 'na';
        },
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
app.use(express.json());

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
app.use(require('./routes/homeRoutes'));
app.use('/admin', authenticate, require('./routes/adminRoutes'));
app.use('/shop', authenticate, require('./routes/shopRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/admin/userManager', require('./routes/admin/userManagerRoutes'));
app.use('/admin/slideManager', require('./routes/admin/slideManagerRoutes'));
app.use('/admin/categoryManager', require('./routes/admin/categoryManagerRoutes'));
app.use(require('./controllers/errorController').get404);
app.use(require('./controllers/errorController').errorLogger);
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
