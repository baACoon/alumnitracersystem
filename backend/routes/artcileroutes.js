import express from 'express';
import multer from 'multer';
import path from 'path';
import Article from '../models/article.js'; // Import the model

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Path to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });


// POST: Add a new article
router.post('/add', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Save the file path if uploaded

    console.log('Request Body:', req.body); // Log the form data
    console.log('Uploaded File:', req.file); // Log the uploaded file

    try {
        const article = new Article({ title, content, image });
        await article.save();
        res.status(201).json({ message: 'Article added successfully!' });
    } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).json({ message: 'Error creating article', error });
    }
});


// PUT: Update article
router.put('/update/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
        const updatedFields = { title, content };
        if (image) updatedFields.image = image;

        const article = await Article.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json({ message: 'Article updated successfully!' });
    } catch (error) {
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
