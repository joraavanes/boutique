const Category = require('../../models/Category');

exports.getCategories = (req, res, next) => {
    Category.find()
        .sort({_id: -1})
        .then(categories => {
            console.log(categories);
            res.send(categories);
        })
        .catch(err => {

        });
};