import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // Image URL
    createdAt: { type: Date, default: Date.now },
});

const News = mongoose.model('News', newsSchema);

export default News; 
