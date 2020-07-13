module.exports = (req, res, next) => {
    req.app.locals._csrf = req.csrfToken();
    next();
};