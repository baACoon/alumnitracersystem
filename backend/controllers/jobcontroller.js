import Job from '../models/job.js';

/**
 * Create a job posting
 */
export const createJob = async (req, res) => {
    try {
        const job = new Job({
            ...req.body,
            createdBy: req.user.id,
            status: 'Pending', // Default status
        });

        await job.save();
        res.status(201).json({ message: 'Job created successfully. Pending admin approval.' });
    } catch (error) {
        console.error('Error creating job:', error.message);
        res.status(500).json({ error: 'Failed to create job.' });
    }
};

/**
 * Get all jobs (filtered by status if needed)
 */
export const getJobs = async (req, res) => {
    try {
        const { status } = req.query; // Optional query param for filtering
        const filter = status ? { status } : {};

        const jobs = await Job.find(filter)
            .populate('createdBy', 'name email') // Populate user details
            .sort({ createdAt: -1 });

        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error.message);
        res.status(500).json({ error: 'Failed to fetch jobs.' });
    }
};

/**
 * Approve a job posting
 */
export const approveJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: 'Published', reviewedBy: req.user.id },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({ error: 'Job not found.' });
        }

        res.status(200).json({ message: 'Job approved successfully.', job });
    } catch (error) {
        console.error('Error approving job:', error.message);
        res.status(500).json({ error: 'Failed to approve job.' });
    }
};

/**
 * Deny a job posting with feedback
 */
export const denyJob = async (req, res) => {
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
        console.error('Error denying job:', error.message);
        res.status(500).json({ error: 'Failed to deny job.' });
    }
};
