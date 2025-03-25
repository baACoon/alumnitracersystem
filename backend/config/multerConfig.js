import multer from 'multer';
import { v2 as cloudinaryUploader } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinaryUploader.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage to keep files in buffer (for Cloudinary)
const storage = multer.memoryStorage();

// Create multer instance with memory storage
const upload = multer({ storage });

const uploadToCloudinary = async (buffer, publicId) => {
  try {
    const result = await cloudinaryUploader.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary', error);
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
