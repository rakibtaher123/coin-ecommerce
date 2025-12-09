const multer = require('multer');
const path = require('path');
const fs = require('fs'); // নতুন ফোল্ডার বানানোর জন্য এটি যোগ করা হলো

// ফোল্ডার পাথ সেট করা: server/middleware থেকে দুই ধাপ পেছনে গিয়ে public/assets
const uploadDir = path.join(__dirname, '../../public/assets');

// যদি ফোল্ডার না থাকে, তবে তৈরি করে নাও (Safety Check)
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ১. স্টোরেজ ইঞ্জিন কনফিগারেশন
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ইমেজগুলো public/assets ফোল্ডারে সেভ হবে
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // ইউনিক নাম তৈরি করা (যাতে একই নামের ছবি রিপ্লেস না হয়ে যায়)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ২. ফাইল ফিল্টার (যাতে শুধু ছবি আপলোড করা যায়)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .png, .jpeg and .webp format allowed!'), false);
  }
};

// ৩. Multer ইনিশিলাইজ করা
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB লিমিট
  fileFilter: fileFilter
});

module.exports = upload;