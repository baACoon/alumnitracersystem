import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import multer from 'multer';
import Article from '../models/article.js'; 
import { sendArticleNotification } from '../emailservice.js';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const Articlestorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'articles', // Change this to your preferred folder name
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const UploadImageArticles = multer ({storage: Articlestorage})

router.post('/add', UploadImageArticles.single('image'), async (req, res) => {
    const { title, content } = req.body;
    let imageUrl = null;

    try {
        if (req.file) {
            imageUrl = req.file.path; // Cloudinary URL is available in `req.file.path`

            const article = new Article({ title, content, image: imageUrl });
            await article.save();

            await sendArticleNotification(title, content);

            res.status(201).json({ message: 'Article added and Notification Sent!' });
        } else {
            const article = new Article({ title, content });
            await article.save();

            await sendArticleNotification(title, content);

            res.status(201).json({ message: 'Article added without image' });
        }
    } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).json({ message: 'Error creating article', error });
    }
});



router.put('/update/:id', UploadImageArticles.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedFields = { title, content };

        // Check if an image was uploaded and update the image URL
        if (req.file) {
            updatedFields.image = req.file.path; // The Cloudinary URL is stored in `req.file.path`
        }

        // Find and update the article
        const article = await Article.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json({ message: 'Article updated successfully!' });
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ message: 'Error updating article', error });
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
