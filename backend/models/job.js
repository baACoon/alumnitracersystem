import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
});

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, default: "full-time" },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },  //  Must be an array
    qualifications: { type: [String], default: [] },  //  Must be an array
    source: { type: String },
    status: { type: String, enum: ["Pending", "Published", "Denied"], default: "Pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);

export default Job;
