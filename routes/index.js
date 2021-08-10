const authenticate = require('../middleware/authenticate');

module.exports = app => {
    app.use(require('./homeRoutes'));
    app.use('/admin', authenticate, require('./adminRoutes'));
    app.use('/shop', authenticate, require('./shopRoutes'));
    app.use('/user', require('./userRoutes'));
    app.use('/products', require('./productRoutes'));
    app.use('/admin/userManager', require('./admin/userManagerRoutes'));
    app.use('/admin/slideManager', require('./admin/slideManagerRoutes'));
    app.use('/admin/categoryManager', require('./admin/categoryManagerRoutes'));
    app.use(require('../controllers/errorController').get404);
    app.use(require('../controllers/errorController').errorLogger);
    app.use(require('../controllers/errorController').getServerError);
};