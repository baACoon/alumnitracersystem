import express from 'express';
import {
    createJob,
    approveJob,
    denyJob,
    getJobs
} from '../controllers/jobcontroller.js';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';

const router = express.Router();

/**
 * @route   POST /jobs/
 * @desc    Create a job posting (by Alumni)
 * @access  Protected (Alumni)
 */
router.post('/', protect, createJob);

/**
 * @route   GET /jobs/
 * @desc    Get all jobs (filtered by status if needed)
 * @access  Protected (Alumni/Admin)
 */
router.get('/', protect, getJobs);

/**
 * @route   POST /jobs/:id/approve
 * @desc    Approve a job posting (Admin Only)
 * @access  Protected (Admin)
 */
router.post('/:id/approve', protect, adminOnly, approveJob);

/**
 * @route   POST /jobs/:id/deny
 * @desc    Deny a job posting with feedback (Admin Only)
 * @access  Protected (Admin)
 */
router.post('/:id/deny', protect, adminOnly, denyJob);

export default router;
