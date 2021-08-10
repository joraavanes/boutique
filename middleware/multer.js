const multer = require('multer');

module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
                callback(null, 'public/user-files');
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
}).single('imageUrl');