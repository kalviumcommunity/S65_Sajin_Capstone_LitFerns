const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        console.log('📂 Upload destination: uploads/');
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        // Add sanitization to prevent directory traversal attacks
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${file.fieldname}-${Date.now()}-${sanitizedName}`;
        console.log('📝 Generated filename:', filename);
        cb(null, filename);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpg|jpeg|png|gif)/.test(file.mimetype);

    console.log('🔍 File type check:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        extname: path.extname(file.originalname),
        extValid: extname,
        mimeValid: mimetype,
    });

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        const error = new Error('Only image files are allowed (jpg, jpeg, png, gif)');
        console.error('❌ File type rejected:', error.message);
        cb(error);
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;