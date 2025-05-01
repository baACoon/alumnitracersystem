import mongoose from "mongoose";

const graduateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String, required: true }
}, { timestamps: true });

const Graduate = mongoose.model("Graduate", graduateSchema);
export default Graduate;
