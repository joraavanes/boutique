const colors = require('colors');
const Slide = require('../models/Slide');

exports.getHome = (req, res, next) => {
    console.log(colors.cyan(req.session));
    if(!req.user) return res.render('home/home');

    let viewData;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(result => {
            viewData = {
                pageTitle: 'Boutique',
                items: req.user.cart.items
            };
            return Slide.find({shown: true});
        })
        .then(slides => {
            viewData.slides = slides;            
            return res.render('home/home', viewData);            
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });;
};