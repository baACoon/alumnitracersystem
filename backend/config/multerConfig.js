import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Use memory storage to keep files in buffer
const storage = multer.memoryStorage();

// Create multer instance with memory storage
const upload = multer({ storage });

// Function to upload files to Cloudinary
const uploadToCloudinary = async (buffer, publicId) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Automatically detect file type (image, video, etc.)
        public_id: publicId,   // Unique identifier for the file (optional)
      },
      (error, result) => {
        if (error) {
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


export default upload;
export { uploadToCloudinary };
