import express from 'express';
import { createJob, approveJob, denyJob, getJobs } from '../controllers/jobcontroller.js';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Routes
router.post('/', protect, createJob); // Alumni creates a job
router.get('/', protect, getJobs); // Alumni/Admin view jobs
router.post('/:id/approve', protect, adminOnly, approveJob); // Admin approves
router.post('/:id/deny', protect, adminOnly, denyJob); // Admin denies with feedback

export default router;
