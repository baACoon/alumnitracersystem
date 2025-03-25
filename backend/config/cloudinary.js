import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (fileBuffer, publicId) => {
    return new Promise((resolve, reject) => {
        const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',   // Auto-detect file type
                public_id: `imagepost/${publicId}`, // Store image in the 'imagepost' folder
                folder: 'imagepost',     // Folder where images are saved in Cloudinary
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result); // Returning the upload result
                }
            }
        );

        const bufferStream = streamifier.createReadStream(fileBuffer); // Convert buffer to stream
        bufferStream.pipe(cloudinaryUploadStream); // Upload the image buffer
    });
};

export default uploadToCloudinary;
