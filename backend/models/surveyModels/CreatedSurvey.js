import mongoose from "mongoose";

const createdSurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "draft" }, // ["draft", "active", "closed"]
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CreatedSurvey", createdSurveySchema);
