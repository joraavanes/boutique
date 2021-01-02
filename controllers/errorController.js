exports.get404 = (req, res, next) => {
    res.status(404).render('error/404');
};

exports.errorLogger = (err, req, res, next) => {
    req.errorMessage = err.message || 'Something went wrong';
    next(err);
};

exports.getServerError = (err, req, res, next) => {
    const errorCode = err.httpStatusCode || 500;
    const errorMessage = err.message || 'Something went wrong';
    
    res.status(errorCode).render('error/500', {
        errorCode,
        errorMessage
    });
};