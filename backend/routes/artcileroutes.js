import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import multer from 'multer';
import Article from '../models/article.js'; 
import { sendArticleNotification } from '../emailservice.js';
import { uploadToCloudinary } from '../config/multerConfig.js';

dotenv.config();

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage});


// POST: Add a new article
router.post('/add', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    let imageUrl = null;

    try {
        if (req.file) {
            const publicId = `article_images_${Date.now()}`; // Unique identifier for the image
            const result = await uploadToCloudinary(req.file.buffer, publicId); // Upload to Cloudinary
            imageUrl = result.secure_url; // Get the secure URL of the uploaded image
        }

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const article = new Article({ title, content, image: imageUrl }); // Store the URL of the image
        await article.save();

        await sendArticleNotification(title, content); // Send email notification

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
