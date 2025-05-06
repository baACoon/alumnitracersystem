// jobroutes.js
import express from 'express';
import { protect } from '../middlewares/authmiddleware.js';
import Job from '../models/job.js';
import { sendJobNotification } from '../emailservice.js'; 
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js'; // same as article route


const router = express.Router();

const JobImageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'jobs', // Folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 600, height: 600, crop: 'limit' }]
    }
  });
  
  const uploadJobImage = multer({ storage: JobImageStorage });
  

// Post job by alumni
router.post('/jobpost', protect, uploadJobImage.single('image'), async (req, res) => {
    try {
      const {
        title, company, location, type,
        description, responsibilities,
        qualifications, source, college, course
      } = req.body;
  
      if (!college || !course) {
        return res.status(400).json({ message: "College and Course are required fields." });
      }
  
      const imageUrl = req.file ? req.file.path : null;
  
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
        image: imageUrl  // Make sure your Job model has `image`
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
      if (!feedback) return res.status(400).json({ error: 'Feedback is required.' });
  
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        {
          isDeleted: true,
          deletedAt: new Date(),
          feedback,
          status: "Denied",
        },
        { new: true }
      );
  
      if (!job) return res.status(404).json({ error: 'Job not found.' });
  
      res.status(200).json({ message: 'Job moved to trash.', job });
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

// Get trashed jobs (within 7 days)
router.get('/trash', protect, async (req, res) => {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const jobs = await Job.find({
        isDeleted: true,
        deletedAt: { $gte: sevenDaysAgo },
        createdBy: req.user.id
      }).sort({ deletedAt: -1 });
  
      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching trashed jobs:', error.message);
      res.status(500).json({ error: 'Failed to fetch trashed jobs.' });
    }
  });

  router.post('/:id/restore', protect, async (req, res) => {
    try {
      const job = await Job.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
        isDeleted: true,
      });
  
      if (!job) return res.status(404).json({ message: 'Job not found or not in trash.' });
  
      const expired = new Date(job.deletedAt).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (expired) return res.status(410).json({ message: 'Recovery period has expired.' });
  
      job.isDeleted = false;
      job.deletedAt = null;
      job.status = 'Pending';
      await job.save();
  
      res.status(200).json({ message: 'Job restored successfully.', job });
    } catch (error) {
      console.error('Error restoring job:', error.message);
      res.status(500).json({ error: 'Failed to restore job.' });
    }
  });

// Update job post
router.put('/:id', protect, async (req, res) => {
    try {
        // Find the job post by ID and update it
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        res.status(200).json(updatedJob); // Send the updated job back in the response
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Failed to update job.' });
    }
});
  
  
export default router;
