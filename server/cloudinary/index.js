const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
}); 

const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'HouseVideos',
      resource_type: 'video',
      transformation: [{ width: 720, crop: 'limit' }] // optional resize
    }
});

const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'PES',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

// Dynamic storage
const dynamicStorage = {
    _handleFile(req, file, cb) {
        const storage = file.mimetype.startsWith('video/')
            ? videoStorage
            : imageStorage;

        storage._handleFile(req, file, cb);
    },
    _removeFile(req, file, cb) {
        const storage = file.mimetype.startsWith('video/')
            ? videoStorage
            : imageStorage;

        storage._removeFile(req, file, cb);
    }
};


module.exports = {
    cloudinary,
    dynamicStorage,
    imageUpload: { storage: imageStorage },
    videoUpload: { storage: videoStorage }
}