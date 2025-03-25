// multerConfig.js
import multer from 'multer';
import cloudinary from './cloudinary';
import { v2 as cloudinaryUploader } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinaryUploader.config({
    cloud_name: 'dhumh210h',
    api_key: '837878367197867',
    api_secret: 'G_BgDH8YxQhpHWKITrUXtMe-Xa8',
});

// Use memory storage to keep files in buffer (for Cloudinary)
const storage = multer.memoryStorage();

// Create multer instance with memory storage
const upload = multer({ storage });

// Function to upload files to Cloudinary
const uploadToCloudinary = async (buffer) => {
  try {
    const result = await cloudinaryUploader.uploader.upload_stream(
      {
        resource_type: 'auto',  // Automatically detect file type (image, video, etc.)
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading file to Cloudinary', error);
          throw error;
        }
        return result;
      }
    );
    buffer.pipe(result);
  } catch (error) {
    console.error('Error uploading to Cloudinary', error);
    throw error;
  }
};

export { upload, uploadToCloudinary };
