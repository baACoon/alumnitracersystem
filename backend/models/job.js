import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
});

const JobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, default: "full-time" },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    qualifications: { type: [String], default: [] },
    source: { type: String },
    college: { type: String, required: true },  
    course: { type: String, required: true },   
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "Pending" },
    feedback: { type: String }, 
    },
    { timestamps: true }
);

const Job = mongoose.model('Job', JobSchema);

export default Job;
