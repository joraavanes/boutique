
module.exports = (req, res, next) => {
    req.app.locals.auth = req.session.auth != undefined;
    next();
};