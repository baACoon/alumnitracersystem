import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import path from 'path';
import Article from '../models/article.js'; 
import { sendArticleNotification } from '../emailservice.js';
import cloudinary from '../config/cloudinary.js' 

dotenv.config();

const router = express.Router();


const storage = multer.memoryStorage(); // Using memory storage as Cloudinary will handle the file

const upload = multer({ storage });

// POST: Add a new article
router.post('/add', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    let imageUrl = null;
  
    try {
      // If there's an image, upload it to Cloudinary
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.buffer, {
          resource_type: "auto",  // Automatically detect file type (image, video, etc.)
          public_id: `article_images/${Date.now()}`, // Add a unique identifier or filename here
        });
  
        imageUrl = result.secure_url;  // Get the secure URL from Cloudinary
      }
  
      // Ensure the title and content are provided
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }
  
      // Save the article to the database
      const article = new Article({ title, content, image: imageUrl });
      await article.save();
  
      // Send email notification
      await sendArticleNotification(title, content);
  
      res.status(201).json({ message: 'Article added successfully and notification sent!' });
    } catch (error) {
      console.error('Error saving article:', error);
      res.status(500).json({ message: 'Error creating article', error: error.message || error });
    }
  });
  

// PUT: Update article
router.put('/update/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    let imageUrl = undefined;
  
    try {
      const updatedFields = { title, content };
  
      // If there is a new image uploaded, upload it to Cloudinary
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.buffer, {
          resource_type: "auto", // Automatically detect file type (image, video, etc.)
          public_id: `article_images/${Date.now()}`,  // Set a unique filename
        });
  
        imageUrl = result.secure_url; // Get the image URL from Cloudinary response
        updatedFields.image = imageUrl; // Set the image URL to the update fields
      }
  
      const article = await Article.findByIdAndUpdate(id, updatedFields, { new: true });
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
  
      res.status(200).json({ message: 'Article updated successfully!' });
    } catch (error) {
      console.error('Error updating article:', error);
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
