import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  source: { type: String },
  image: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
});


const Event = mongoose.model('Event', eventSchema);

export default Event;
