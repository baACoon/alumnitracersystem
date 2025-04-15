import mongoose from "mongoose";

const TracerSurvey2Schema = new mongoose.Schema({
  userId: String,
  education: [
    {
      degree: String,
      college: String,
      yearGraduated: String,
      honors: String,
    },
  ],
  examinations: [
    {
      examName: String,
      dateTaken: String,
      rating: String,
    },
  ],
  reasons: Object,
  trainings: [
    {
      title: String,
      duration: String,
      institution: String,
    },
  ],
  motivation: Object,
  employmentStatus: String,
  unemploymentReasons: Object,
  jobDetails: Object,
}, { timestamps: true });

const TracerSurvey2 = mongoose.model("TracerSurvey2", TracerSurvey2Schema);
export default TracerSurvey2;
