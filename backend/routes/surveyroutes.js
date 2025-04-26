// surveyroutes.js (Enhanced Backend)
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Student } from "../record.js";
import TracerSurvey2 from "../models/TracerSurvey2.js";

const router = express.Router();

const surveyTypes = {
  TRACER1: "Tracer1",
  TRACER2: "Tracer2",
};

const surveySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    surveyType: { 
      type: String, 
      enum: Object.values(surveyTypes),
      required: true 
    },
    date: { type: Date, default: Date.now },
    personalInfo: { type: mongoose.Schema.Types.Mixed, required: true },
    employmentInfo: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SurveySubmission = mongoose.model("surveys", surveySchema);

export const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided." });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = user;
    next();
  });
};

router.post("/submit/:surveyType", authenticateToken, async (req, res) => {
  const { surveyType } = req.params;
  const userId = req.body.userId;

  if (!Object.values(surveyTypes).includes(surveyType))
    return res.status(400).json({ message: "Invalid survey type." });

  const userExists = await Student.findById(userId);
  if (!userExists) return res.status(400).json({ message: "User not found." });

  const submission = new SurveySubmission({ userId, surveyType, ...req.body });
  await submission.save();

  res.status(201).json({ success: true, message: `Survey ${surveyType} submitted successfully` });
});

router.get("/pending/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const completedTypes = await SurveySubmission.find({ userId }).distinct('surveyType');

  const availableSurveys = [
    { id: surveyTypes.TRACER1, title: "Tracer Survey 1" },
    { id: surveyTypes.TRACER2, title: "Tracer Survey 2" },
  ];

  const pendingSurveys = availableSurveys.filter(survey => !completedTypes.includes(survey.id));
  res.json({ surveys: pendingSurveys });
});

router.get("/completed/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const objectId = new mongoose.Types.ObjectId(userId); // ✅ convert to ObjectId

    const submissions = await SurveySubmission.find({ userId: objectId }).sort({ createdAt: -1 });

    const completedSurveys = submissions.map(survey => ({
      id: survey._id,
      surveyType: survey.surveyType,
      title: `${survey.surveyType} Survey`,
      dateCompleted: survey.createdAt.toLocaleDateString(),
    }));

    res.json({ surveys: completedSurveys });
  } catch (error) {
    console.error("Failed to fetch completed surveys:", error);
    res.status(500).json({ message: "Failed to fetch completed surveys", error: error.message });
  }
});


router.get("/user-status/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const objectId = new mongoose.Types.ObjectId(userId); // Important!

  const completedTypes = await SurveySubmission.find({ userId: objectId }).distinct('surveyType');
  const tracer2 = await TracerSurvey2.findOne({ userId: objectId });

  console.log("📥 Received request for user-status:", req.params.userId);

  const status = {
    tracer1Completed: completedTypes.includes("Tracer1"),
    tracer2Completed: !!tracer2,
    currentlyTaking: completedTypes.length === 0 ? "Tracer1" : !tracer2 ? "Tracer2" : null,
  };

  res.json({ status });
});

export default router;
