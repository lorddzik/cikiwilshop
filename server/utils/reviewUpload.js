// server/utils/reviewUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Fungsi untuk memastikan direktori ada
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Filter untuk foto dan video
const mediaFileFilter = (req, file, cb) => {
    // Mendukung foto dan video
    const imageTypes = /jpeg|jpg|png|webp/;
    const videoTypes = /mp4|webm/;

    const mimetype = imageTypes.test(file.mimetype) || videoTypes.test(file.mimetype);
    const extname = imageTypes.test(path.extname(file.originalname).toLowerCase()) ||
        videoTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Hanya foto (jpeg, jpg, png, webp) dan video (mp4, webm) yang diizinkan!'), false);
    }
};

// Storage untuk review media
const reviewMediaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/uploads/reviews';
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const isVideo = /mp4|webm/.test(path.extname(file.originalname).toLowerCase());
        const prefix = isVideo ? 'review-video' : 'review-photo';
        cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Middleware untuk upload review media
const uploadReviewMedia = multer({
    storage: reviewMediaStorage,
    fileFilter: mediaFileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB max (untuk video)
    },
});

module.exports = {
    uploadReviewMedia,
};
