import Job from '../models/job.js'; // Ensure the file path is correct and includes the `.js` extension

export const createJob = async (req, res) => {
    try {
        const { title, company, location, type, description, responsibilities, qualifications, source } = req.body;
        const job = await Job.create({
            title,
            company,
            location,
            type,
            description,
            responsibilities,
            qualifications,
            source,
            createdBy: req.user.id,
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('createdBy', 'name')
            .populate('reviewedBy', 'name');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const approveJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: 'Published', reviewedBy: req.user.id },
            { new: true }
        );
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const denyJob = async (req, res) => {
    try {
        const { feedback } = req.body;
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: 'Denied', feedback, reviewedBy: req.user.id },
            { new: true }
        );
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
