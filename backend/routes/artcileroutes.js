import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import multer from 'multer';
import Article from '../models/article.js'; 
import { sendArticleNotification } from '../emailservice.js';
import cloudinary from '../config/cloudinary.js';


dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
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



router.put('/update/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedFields = { title, content };

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'articles' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                require('streamifier').createReadStream(req.file.buffer).pipe(uploadStream);
            });

            updatedFields.image = result.secure_url;
        }

        const article = await Article.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!article) return res.status(404).json({ message: 'Article not found' });

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
