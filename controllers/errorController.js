
exports.get404 = (req, res, next) => {
    res.status(404).render('error/404');
};

exports.getServerError = (err, req, res, next) => {
    res.status(err.httpStatusCode).render('error/500');
};