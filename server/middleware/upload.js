const multer = require('multer');
const path = require('path');

// স্টোরেজ ইঞ্জিন কনফিগারেশন
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // ছবিগুলো যেখানে সেভ হবে
        cb(null, path.join(__dirname, '../public/assets'));
    },
    filename: (req, file, cb) => {
        // ফাইলের নাম ইউনিক করা (timestamp + original name)
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});

// ফাইল ফিল্টার (শুধু ছবি এলাউ করবে)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
    fileFilter: fileFilter
});

module.exports = upload;