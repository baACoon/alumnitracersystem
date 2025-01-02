import express from 'express';
import { protect } from '../middlewares/authmiddleware.js';
import Job from '../models/job.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'Invalid user information' });
        }

        const newJob = new Job({
            ...req.body,
            createdBy: req.user.id, // Use the authenticated user's ID
        });
        await newJob.save();
        res.status(201).json({ message: 'Job posted successfully!' });
    } catch (error) {
        console.error('Error saving job:', error);
        res.status(500).json({ error: 'Failed to post the job' });
    }
});

export default router;
