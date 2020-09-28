const { Router } = require('express');
const csrf = require('csurf');
const multer = require('multer');
const slideManagerController = require('../../controllers/admin/slideManagerController');

const router = Router();

router.get('/', slideManagerController.getSlides);

router.get(
    '/new-slide',
    csrf(),
    require('../../middleware/csrfTokens'),
    slideManagerController.getNewSlide);

router.post(
    '/new-slide',
    multer({
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                    callback(null, 'public/slides');
            },
            filename: (req, file, callback) => {
                    callback(null, `${new Date().getTime()}-${file.originalname}`);
            },
            fileFilter: (req, file, callback) => {
                if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg')
                    callback(null, true);
                else
                    callback(null, false);
            },
        })
    }).single('imgUrl'),
    csrf(),
    require('../../middleware/csrfTokens'),
    slideManagerController.postNewSlide
);

router.get(
    '/edit-slide/:_id',
    csrf(),
    require('../../middleware/csrfTokens'),
    slideManagerController.getEditSlide
);

router.post(
    '/edit-slide',
    multer({
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                    callback(null, 'public/slides');
            },
            filename: (req, file, callback) => {
                    callback(null, `${new Date().getTime()}-${file.originalname}`);
            },
            fileFilter: (req, file, callback) => {
                if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg')
                    callback(null, true);
                else
                    callback(null, false);
            },
        })
    }).single('imgUrl'),
    csrf(),
    require('../../middleware/csrfTokens'),
    slideManagerController.postEditSlide
);

module.exports = router;