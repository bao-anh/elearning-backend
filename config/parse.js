const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dp3j2tstm',
  api_key: '372247664735633',
  api_secret: 'cZBkHSVV7jyvlQ62HR6VIHl-QQQ',
});

// cloudinary.uploader.upload("sample.jpg", {"crop":"limit","tags":"samples","width":3000,"height":2000}, function(result) { console.log(result) });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'demo',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 200, height: 200, crop: 'limit' }],
});
const parser = multer({ storage: storage });

module.exports = parser;
