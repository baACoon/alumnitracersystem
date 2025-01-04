import express from 'express';
import { protect } from '../middlewares/authmiddleware.js';
import Job from '../models/job.js';

const router = express.Router();

router.post('/jobpost', protect, async (req, res) => {
    try {
        const job = new Job({
            ...req.body,
            createdBy: req.user.id, // Attach user ID directly from middleware
            status: 'Pending',
        });

        await job.save();
        res.status(201).json({ message: 'Job posted successfully. Pending admin approval.' });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ message: 'Failed to post the job.' });
    }
});


router.get('/jobpost', protect, async (req, res) => {
    try {
        const { status } = req.query; // Optional query param for filtering by status
        const filter = status ? { status } : {};

        const jobs = await Job.find(filter)
            .populate('createdBy', 'name email') // Populate user details (optional)
            .sort({ createdAt: -1 }); // Sort by most recent

        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error Fetching Jobs:', error.message);
        res.status(500).json({ error: 'Failed to fetch jobs.' });
    }
});

// Approve a job posting
router.post('/:id/approve', protect, async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: 'Published', reviewedBy: req.user.id },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        res.status(200).json({ message: 'Job approved successfully.', job });
    } catch (error) {
        console.error('Error approving job:', error.message);
        res.status(500).json({ message: 'Failed to approve job.' });
    }
});



router.post('/:id/deny', protect, async (req, res) => {
    try {
        const { feedback } = req.body;

        if (!feedback) {
            return res.status(400).json({ error: 'Feedback is required to deny a job.' });
        }

        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: 'Denied', feedback, reviewedBy: req.user.id },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({ error: 'Job not found.' });
        }

        res.status(200).json({ message: 'Job denied successfully.', job });
    } catch (error) {
        console.error('Error Denying Job:', error.message);
        res.status(500).json({ error: 'Failed to deny job.' });
    }
});

export default router;
