const multer = require('multer');
// const cloudinary = require('../config/cloudinaryConfig');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// console.log(cloudinary)

const uploadToCloudinary = async (req, res, next) => {
  try {
    const files = req.files ? req.files : (req.file ? [req.file] : []);
    
    if (files.length === 0) {
      return next(); 
    }

    // Handle file upload to Cloudinary
    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'properties' }, 
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result.secure_url); 
          }
        );
        stream.end(file.buffer); 
      });
    });

    const results = await Promise.all(uploadPromises);
    req.fileUrls = results; 

    next(); 
  } catch (error) {
    next(error); 
  }
};

const uploadFile = (maxCount = 7) => { 
  return [upload.array('images', maxCount), uploadToCloudinary];
};

module.exports = uploadFile;
