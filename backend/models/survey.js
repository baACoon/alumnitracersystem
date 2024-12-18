import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  date: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  middle_name: { type: String },
  college: { type: String, required: true },
  course: { type: String, required: true },
  occupation: { type: String, required: true },
  company_name: { type: String, required: true },
  year_started: { type: String, required: true },
  position: { type: String, required: true },
  job_status: { type: String, required: true },
  type_of_organization: { type: String, required: true },
  work_alignment: { type: String, required: true },
});

export default mongoose.model("Survey", surveySchema);
