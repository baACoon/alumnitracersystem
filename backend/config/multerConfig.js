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
  

// Create multer instance with memory storage (for Cloudinary)
const storage = multer.memoryStorage(); 

const upload = multer({ storage });

const uploadToCloudinary = async (fileBuffer, publicId) => {
    try {
        const result = await cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto', // Auto-detect file type
                public_id: `imagepost/${publicId}`, // Specify the folder 'imagepost' in the public ID
                folder: 'imagepost', // Specify folder name
            },
            (error, result) => {
                if (error) {
                    throw new Error(error.message);
                }
                return result;
            }
        );

        const bufferStream = require('streamifier').createReadStream(fileBuffer);
        bufferStream.pipe(result); // Upload the image buffer to Cloudinary

    } catch (error) {
        throw new Error('Error uploading image to Cloudinary: ' + error.message);
    }
};   

export default upload;
export { uploadToCloudinary };
