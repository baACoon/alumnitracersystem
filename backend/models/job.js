import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    type: String,
    description: String,
    responsibilities: [String],
    qualifications: [String],
    source: String,
    status: { type: String, default: 'Pending' }, // Pending, Published, Denied
    feedback: String, // For denied posts
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Alumni ID
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin ID
}, { timestamps: true });

export default mongoose.model('Job', JobSchema);
