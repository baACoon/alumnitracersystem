import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import multer from 'multer';
import Article from '../models/article.js'; 
import { sendArticleNotification } from '../emailservice.js';
import  uploadToCloudinary  from '../config/cloudinary.js';

dotenv.config();

const router = express.Router();

// Configure Multer for file uploads (diskStorage now to upload to Cloudinary directly)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Local path, not used, image goes to Cloudinary
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// POST: Add a new article
router.post('/add', upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  let imageUrl = null;

  if (req.file) {
    console.log('File received:', req.file);

    try {
      // Upload the image to Cloudinary and get the secure URL
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;  // Cloudinary URL
      console.log('Image uploaded to Cloudinary:', imageUrl);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return res.status(500).json({ message: 'Error uploading image to Cloudinary', error });
    }
  }

  // Ensure title and content are provided
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    // Save the article with the title, content, and Cloudinary image URL
    const article = new Article({ title, content, imageUrl });
    await article.save();

    // Send email notification
    await sendArticleNotification(title, content);

    res.status(201).json({ message: 'Article added successfully and notification sent!' });
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ message: 'Error creating article', error });
  }
});

// PUT: Update an existing article
router.put('/update/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  let imageUrl = undefined;

  const updatedFields = { title, content };

  if (req.file) {
    try {
      // Upload new image to Cloudinary and get the URL
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
      updatedFields.imageUrl = imageUrl;  // Update the image URL
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return res.status(500).json({ message: 'Error uploading image to Cloudinary', error });
    }
  }

  try {
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
