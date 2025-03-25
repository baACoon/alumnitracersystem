import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload the image to Cloudinary
const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        // Check if file is a buffer (for memory storage) or a file path (for disk storage)
        if (file.buffer) {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',   // Auto-detect file type (image, video, etc.)
                    folder: 'imagepost',     // Specify the folder in Cloudinary
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);  // Resolving with the result (includes URL)
                    }
                }
            ).end(file.buffer);  // Pass the buffer directly
        } else {
            // If it's a file path (when using diskStorage)
            cloudinary.uploader.upload(
                file.path,  // file.path is the file path provided by Multer
                {
                    resource_type: 'auto',   // Auto-detect file type
                    folder: 'imagepost',     // Specify the folder in Cloudinary
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);  // Resolving with the result (includes URL)
                    }
                }
            );
        }
    });
};

  

export default uploadToCloudinary;
