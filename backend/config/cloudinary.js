import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use Cloudinary's upload method that directly accepts the file path (no buffer)
const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,  // file.path is the file path provided by Multer
        {
          resource_type: 'auto', // Auto-detect file type (image, video, etc.)
          folder: 'imagepost',   // Specify the folder in Cloudinary
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  };
  

export default uploadToCloudinary;
