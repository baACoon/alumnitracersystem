// jobroutes.js
import express from 'express';
import { protect } from '../middlewares/authmiddleware.js';
import Job from '../models/job.js';
import { sendJobNotification } from '../emailservice.js'; 

const router = express.Router();

// Post job by alumni
router.post('/jobpost', protect, async (req, res) => {
    try {
        const { title, company, location, type, description, responsibilities, qualifications, source, college, course } = req.body;

        if (!college || !course) {
            return res.status(400).json({ message: "College and Course are required fields." });
        }

        const job = new Job({
            title,
            company,
            location,
            type,
            description,
            responsibilities,
            qualifications,
            source,
            college,
            course,
            createdBy: req.user.id,
            status: 'Pending',
        });

        await job.save();
        res.status(201).json({ message: 'Job posted successfully. Pending admin approval.' });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ message: 'Failed to post the job.' });
    }
});

// Fetch jobs for logged-in user only
router.get('/jobpost', protect, async (req, res) => {
    try {
        const { status, createdBy } = req.query;
        const filter = {};

        if (status) {
            filter.status = { $in: status.split(',') };
        }

        if (createdBy) {
            filter.createdBy = createdBy;
        }

        const jobs = await Job.find(filter).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error.message);
        res.status(500).json({ error: 'Failed to fetch jobs.' });
    }
});

// Approve a job posting
router.post('/:id/approve', protect, async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: 'Published' },
            { new: true }
        );

        if (!job) return res.status(404).json({ message: 'Job not found.' });

        // ✅ Send email when admin approves a pending job
        await sendJobNotification(job.title, job.company, job.description);

        res.status(200).json({ message: 'Job approved successfully.', job });
    } catch (error) {
        console.error('Error approving job:', error.message);
        res.status(500).json({ message: 'Failed to approve job.' });
    }
});

// Delete job
router.delete('/:id', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        if (job.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this job.' });
        }

        await job.deleteOne();
        res.status(200).json({ message: 'Job deleted successfully.' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Failed to delete job.' });
    }
});

// Deny a job with feedback
router.post('/:id/deny', protect, async (req, res) => {
    try {
        const { feedback } = req.body;
        if (!feedback) return res.status(400).json({ error: 'Feedback is required to deny a job.' });

        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: 'Denied', feedback, reviewedBy: req.user.id },
            { new: true }
        );

        if (!job) return res.status(404).json({ error: 'Job not found.' });

        res.status(200).json({ message: 'Job denied successfully.', job });
    } catch (error) {
        console.error('Error Denying Job:', error.message);
        res.status(500).json({ error: 'Failed to deny job.' });
    }
});

// Add comment to job
router.post('/:id/comments', protect, async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment) return res.status(400).json({ message: 'Comment is required.' });

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        const newComment = {
            text: comment,
            user: req.user.id,
            date: new Date(),
        };

        job.comments = [...(job.comments || []), newComment];
        await job.save();

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error.message);
        res.status(500).json({ message: 'Failed to add comment.' });
    }
});

// Get comments for a job
router.get('/:id/comments', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('comments.user', 'name email');
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        res.status(200).json(job.comments || []);
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ message: 'Failed to fetch comments.' });
    }
});

// Admin only: Create job post
router.post('/create', protect, async (req, res) => {
    try {
        const { title, company, location, type, description, responsibilities, qualifications, source, college, course, status } = req.body;

        if (!college || !course || !title || !company || !location || !description) {
            return res.status(400).json({ message: "All required fields must be provided!" });
        }

        const job = new Job({
            title,
            company,
            location,
            type,
            description,
            responsibilities,
            qualifications,
            source,
            college,
            course,
            createdBy: req.user.id,
            status: status || 'Published',
        });

        await job.save();

        // ✅ Send notification if admin directly publishes the job
        if (job.status === 'Published') {
            await sendJobNotification(job.title, job.company, job.description);
        }

        res.status(201).json({ message: 'Job posted successfully.' });
    } catch (error) {
        console.error('Error posting job:', error.message);
        res.status(500).json({ message: 'Failed to post the job.', error: error.message });
    }
});

export default router;
