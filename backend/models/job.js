import express from 'express';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';
import Job from '../models/job.js';

const router = express.Router();

/**
 * @route   POST /jobs/
 * @desc    Create a new job posting
 * @access  Protected (Alumni)
 */
router.post('/jobadmin', protect, async (req, res) => {
    try {
        const newJob = new Job({
            ...req.body,
            createdBy: req.user.id, // Authenticated user ID
            status: 'Pending', // Default status
        });

        await newJob.save();
        res.status(201).json({ message: 'Job posted successfully. Pending admin approval.' });
    } catch (error) {
        console.error('Error Saving Job:', error.message);
        res.status(500).json({ error: 'Failed to post the job.' });
    }
});

/**
 * @route   GET /jobs/
 * @desc    Get all jobs (optionally filtered by status)
 * @access  Protected (Alumni/Admin)
 */
router.get('/', protect, async (req, res) => {
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

/**
 * @route   POST /jobs/:id/approve
 * @desc    Approve a job posting
 * @access  Protected (Admin Only)
 */
router.post('/:id/approve', protect, adminOnly, async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: 'Published', reviewedBy: req.user.id }, // Approve the job
            { new: true }
        );

        if (!job) {
            return res.status(404).json({ error: 'Job not found.' });
        }

        res.status(200).json({ message: 'Job approved successfully.', job });
    } catch (error) {
        console.error('Error Approving Job:', error.message);
        res.status(500).json({ error: 'Failed to approve job.' });
    }
});

/**
 * @route   POST /jobs/:id/deny
 * @desc    Deny a job posting with feedback
 * @access  Protected (Admin Only)
 */
router.post('/:id/deny', protect, adminOnly, async (req, res) => {
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
