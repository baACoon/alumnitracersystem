import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "CreatedSurvey", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add this line
  submittedAt: { type: Date, default: Date.now },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
      response: { type: String, required: true }
    }
  ],
  dateCompleted: { type: Date, default: Date.now }
});

export default mongoose.model("Response", responseSchema);
