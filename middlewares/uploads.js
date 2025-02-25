const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'issue_reports', // Cloudinary folder for storing images
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
  },
}
);

// Multer upload configuration
const upload = multer({ storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
 });

// Export image upload function
const uploadImage = (file) => {
  console.log("entered upload")
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error, result) => {
      if (error) {
        console.log("error uploading image to cloudinary")
        return reject('Error uploading image to Cloudinary');
      }
      console.log("upload image done and url sending to controller");
      resolve(result.secure_url); // Return the URL of the uploaded image
    });
  });
};

module.exports = { upload, uploadImage };
