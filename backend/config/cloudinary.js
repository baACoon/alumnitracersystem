import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (fileBuffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            { 
                resource_type: 'auto',   // Auto-detect file type (image, video, etc.)
                public_id: `imagepost/${publicId}`,  // Upload to 'imagepost' folder
                folder: 'imagepost',      // Specify folder name
                buffer: fileBuffer        // Pass the buffer directly
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else {
                    console.log('Cloudinary upload successful:', result);
                    resolve(result);
                }
            }
        );
    });
};

export default uploadToCloudinary;
