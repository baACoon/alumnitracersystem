import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import multer from 'multer';
import Article from '../models/article.js'; 
import { sendArticleNotification } from '../emailservice.js';
import  uploadToCloudinary  from '../config/cloudinary.js';

dotenv.config();

const router = express.Router();

// Set up multer (memory storage for uploading files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Maximum file size allowed (5MB limit)
const MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5MB

// POST: Add a new article
router.post('/add', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    let imageUrl = null;

    // Check if a file was uploaded and handle image upload to Cloudinary
    if (req.file) {
        console.log('File received:', req.file);

        // Check file size
        if (req.file.size > MAX_FILE_SIZE) {
            return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
        }

        try {
            // Upload image to Cloudinary and get the URL
            const result = await uploadToCloudinary(req.file);
            imageUrl = result.secure_url;
            console.log('Image uploaded to Cloudinary:', imageUrl);
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            return res.status(500).json({ message: 'Error uploading image to Cloudinary', error });
        }
    }

    // Ensure title and content are provided
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        // Create and save the article with the Cloudinary image URL
        const article = new Article({ title, content, image: imageUrl });
        await article.save();

        // Send email notification to users (optional)
        await sendArticleNotification(title, content);

        res.status(201).json({ message: 'Article added successfully and notification sent!' });
    } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).json({ message: 'Error creating article', error });
    }
});



// PUT: Update article
router.put('/update/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    let imageUrl = undefined;

    try {
        const updatedFields = { title, content };

        if (req.file) {
            const publicId = `article_images/${Date.now()}`;
            const result = await uploadToCloudinary(req.file.buffer, publicId);
            imageUrl = result.secure_url;
            updatedFields.image = imageUrl;
        }

        const article = await Article.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json({ message: 'Article updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating article', error: error.message || error });
    }
});


// DELETE: Delete article
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const article = await Article.findByIdAndDelete(id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json({ message: 'Article deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting article', error });
    }
});

// GET: Fetch all articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 }); // Fetch articles sorted by date
        res.status(200).json(articles); // Return the articles as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching articles', error });
    }
});

export default router;
