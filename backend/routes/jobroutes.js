import express from 'express';
import { protect } from '../middlewares/authmiddleware.js';
import Job from '../models/job.js';

const router = express.Router();

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


// Fetch all jobs (with optional filtering by status)
router.get('/jobpost', protect, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status: { $in: status.split(',') } } : {};

        const jobs = await Job.find(filter)
            .populate('createdBy', 'name email') 
            .sort({ createdAt: -1 });

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

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        res.status(200).json({ message: 'Job approved successfully.', job });
    } catch (error) {
        console.error('Error approving job:', error.message);
        res.status(500).json({ message: 'Failed to approve job.' });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        res.status(200).json({ message: 'Job deleted successfully.' });
    } catch (error) {
        console.error('Error deleting job:', error.message);
        res.status(500).json({ message: 'Failed to delete job.' });
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

router.post('/:id/comments', protect, async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ message: 'Comment is required.' });
        }

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Add the comment to the job's comments array
        const newComment = {
            text: comment,
            user: req.user.id, // Associate the comment with the logged-in user
            date: new Date(),
        };

        job.comments = [...(job.comments || []), newComment];
        await job.save();

        res.status(201).json(newComment); // Return the newly added comment
    } catch (error) {
        console.error('Error adding comment:', error.message);
        res.status(500).json({ message: 'Failed to add comment.' });
    }
});

// Get comments for a job
router.get('/:id/comments', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('comments.user', 'name email');

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        res.status(200).json(job.comments || []);
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ message: 'Failed to fetch comments.' });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found.' });
      }
      res.status(200).json({ message: 'Job deleted successfully.' });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ message: 'Failed to delete job.' });
    }
  });

 // Admin only - Create Job
router.post('/create', protect, async (req, res) => {
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
            status: status || 'Pending',
        });

        await job.save();
        res.status(201).json({ message: 'Job posted successfully. Pending admin approval.' });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ message: 'Failed to post the job.' });
    }
});


export default router;