const colors = require('colors');
const Slide = require('../models/Slide');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { ObjectID } = require('mongodb');

exports.getHome = async (req, res, next) => {
    console.log(colors.cyan(req.session));
    const slides = await Slide.find({shown: true});

    if(!req.user) {
        return res.render('home/home', {slides});
    }
    
    const recommendedItems = await req.user.recommendedItems();

    res.render('home/home', {
        slides,
        items: req.user.cart.items,
        recommendedItems
    });

    // req.user
    //     .populate('cart.items.productId')
    //     .execPopulate()
    //     .then(result => {
    //         viewData = {
    //             pageTitle: 'Boutique',
    //             items: req.user.cart.items
    //         };
    //         return Slide.find({shown: true});
    //     })
    //     .then(slides => {
    //         viewData.slides = slides;            
    //         return res.render('home/home', viewData);            
    //     })
    //     .catch(err => {
    //         const error = new Error(err);
    //         error.httpStatusCode = 500;
    //         return next(error);
    //     });
};

exports.tryAgg = async (req, res, next) => {
    
    // Order.aggregate([{
    //     $group:{
    //             _id: "$items.product._id",
    //             obj: { $push: { date: "$issuedDate", title: "$items.product.title" } }
    //         }
    // }])
    // .then(doc => {
    //     res.send(doc);
    // });
};