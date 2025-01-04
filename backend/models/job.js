import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String },
        type: { type: String, enum: ['full-time', 'part-time'], default: 'full-time' },
        description: { type: String },
        responsibilities: [String],
        qualifications: [String],
        source: { type: String },
        status: { type: String, enum: ['Pending', 'Published', 'Denied'], default: 'Pending' },
        feedback: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const Job = mongoose.model('Job', JobSchema);

export default Job;
