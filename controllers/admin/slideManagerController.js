const Slide = require('../../models/Slide');

exports.getSlides = (req, res, next) => {
    Slide.find()
        .then(slides => {
            res.render('admin/slideManager/default',{
                slides
            });
        }).catch((err) => {
            const error = new Error();
            return next(error);
        });
};

exports.getNewSlide = (req, res, next) => {
    res.render('admin/slideManager/new-slide');
};

exports.postNewSlide = (req, res, next) => {
    const {title, hyperlink, shown} = req.body;
    const image = req.file;

    if(!image){
        return res.render('admin/slideManager/new-slide');
    }

    const slide = new Slide({
        title,
        hyperlink,
        imgUrl: image.path,
        shown: shown == 'on' ? true : false,
        order: 1});

    slide.save()
        .then(result => {
            console.log(result);

            res.redirect('/admin/slideManager/');
        })
        .catch(err=> {
            const error = new Error();
            return next(error);
        });
};
exports.getEditSlide = (req, res, next) => {};
exports.postEditSlide = (req, res, next) => {};
exports.postDeleteSlide = (req, res, next) => {};