const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config(); // Load environment variables

// Cloudinary Configuration (Use Environment Variables for Security)
cloudinary.config({
  cloud_name: "dhgswebwz",
  api_key: "435148985132963",
  api_secret: "hlfDzEKUciCus4jg7hmMXU0BcA4",
});

// File Filter for Allowed Formats
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'uploads';
    if (req.baseUrl.includes('messages')) {
      folder = 'chat-attachments';
    }
    return {
      folder,
      resource_type: 'auto', // This allows for both images and other file types
      format: file.mimetype.split('/')[1],
    };
  },
});


const upload = multer({ storage, fileFilter });

module.exports = upload;
