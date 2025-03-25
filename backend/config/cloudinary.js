import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,  // Using diskStorage now, so file.path is used here
      {
        resource_type: 'auto',  // Auto-detect the file type
        folder: 'assets',  // Save it in the 'assets' folder in Cloudinary
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);  // Resolving with the result (includes URL)
        }
      }
    );
  });
};

export default uploadToCloudinary;
