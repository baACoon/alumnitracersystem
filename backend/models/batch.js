// models/batchModel.js
import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  year: Number,
  title: String,
  importedDate: Date
});

export default mongoose.model("Batch", batchSchema);
