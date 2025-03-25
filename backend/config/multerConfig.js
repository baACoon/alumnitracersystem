import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage to keep files in buffer (for Cloudinary)
const storage = multer.memoryStorage(); 

// Create multer instance with memory storage
const upload = multer({ storage });

// Function to upload files to Cloudinary
const uploadToCloudinary = async (buffer) => {
  try {
    // Upload the image directly to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',  // Automatically detect file type (image, video, etc.)
        public_id: `article_images/${Date.now()}`, // Optional: Add a unique identifier or filename here
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

export default upload;
export { uploadToCloudinary };
