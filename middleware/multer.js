const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileNewName = Date.now() + path.extname(file.originalname);
        cb(null, fileNewName);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 3,
};

const upload = multer({
    storage,
    limits
});

module.exports = upload
