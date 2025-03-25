import multer from 'multer';
import { v2 as cloudinaryUploader } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Create multer instance with memory storage (for Cloudinary)
const storage = multer.memoryStorage(); 

const upload = multer({ storage });

// Function to upload files to Cloudinary
const uploadToCloudinary = async (buffer, publicId) => {
    try {
      const result = await cloudinaryUploader.uploader.upload_stream(
        {
          resource_type: 'auto',
          public_id: publicId, 
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
          }
          return result;  // Return the result containing the secure URL
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
