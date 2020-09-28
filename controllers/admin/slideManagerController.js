const Slide = require('../../models/Slide');
const { removeFile } = require('../../utils/lib');

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
        order: 1
    });

    slide.save()
        .then(result => {
            res.redirect('/admin/slideManager/');
        })
        .catch(err=> {
            const error = new Error();
            return next(error);
        });
};

exports.getEditSlide = (req, res, next) => {
    const {_id} = req.params;

    Slide.findById(_id)
        .then(slide => {
            res.render('admin/slideManager/edit-slide', {
                pageTitle: slide.title,
                slide
            });
        })
        .catch((err) => {
            const error = new Error(err);
            return next(error);
        });
};

exports.postEditSlide = (req, res, next) => {
    const {_id, title, hyperlink, shown} = req.body;
    const image = req.file;

    const updatedSlide = {
            title,
            hyperlink,
            shown: shown == 'on' ? true : false
        };

    if(image){
        updatedSlide.imgUrl = image.path;
    }    

    Slide.findOneAndUpdate(
        {_id},
        updatedSlide,
        {new: false})
        .then(slide => {
            if(image){
                removeFile(slide.imgUrl);
            }

            res.redirect('/admin/slideManager');
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });

};

exports.postDeleteSlide = (req, res, next) => {};