// routes/pendingRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import CreatedSurvey from "../models/surveyModels/CreatedSurvey.js";
import Question from "../models/surveyModels/Questions.js";  
import Response from "../models/surveyModels/Response.js";
import TracerSurvey2 from "../models/TracerSurvey2.js";
import { authenticateToken } from './surveyroutes.js';
import { Student } from "../../backend/record.js"; // Assuming you have a Student model


const router = express.Router();

// Get pending custom surveys for a user (dynamic)
router.get("/dynamic/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const completedResponses = await Response.find({ userId }).select('surveyId');
    const completedSurveyIds = completedResponses.map(r => r.surveyId.toString());

    const activeSurveys = await CreatedSurvey.find({ status: "active" });

    const pendingSurveys = activeSurveys.filter(s => !completedSurveyIds.includes(s._id.toString()));

    res.status(200).json({ surveys: pendingSurveys });
  } catch (error) {
    console.error("Error fetching pending dynamic surveys:", error);
    res.status(500).json({ message: "Failed to fetch pending surveys" });
  }
});

// (Optional) Get pending tracer 2 eligibility
router.get("/tracer2/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const tracer2 = await TracerSurvey2.findOne({ userId });

    if (tracer2) {
      return res.status(200).json({ eligible: false, message: "Already answered Tracer 2" });
    }

    // else eligible
    return res.status(200).json({ eligible: true });
  } catch (error) {
    console.error("Error checking tracer 2 eligibility:", error);
    res.status(500).json({ message: "Failed to check tracer 2 eligibility" });
  }
});
// ✅ 1. Get Completed Dynamic Surveys
router.get("/completed/:userId", authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const objectId = new mongoose.Types.ObjectId(userId);
  
      const responses = await Response.find({ userId: objectId })
        .populate('surveyId')
        .sort({ submittedAt: -1 });
  
      const surveys = responses.map(r => ({
        id: r._id, // ✅ Important: use Response._id here
        surveyId: r.surveyId?._id,
        title: r.surveyId?.title || "Unnamed Survey",
        dateCompleted: r.dateCompleted,
      }));
  
      res.status(200).json({ surveys });
    } catch (error) {
      console.error("Error fetching completed dynamic surveys:", error);
      res.status(500).json({ error: "Failed to fetch completed dynamic surveys" });
    }
  });
  
  // ✅ 2. Get Single Submitted Dynamic Survey Response
  router.get("/response/:responseId", authenticateToken, async (req, res) => {
    try {
      const { responseId } = req.params;
  
      const responseDoc = await Response.findById(responseId).populate('surveyId');
      if (!responseDoc) {
        return res.status(404).json({ message: "Response not found" });
      }
  
      const questions = await Question.find({ surveyId: responseDoc.surveyId._id });
  
      res.status(200).json({
        surveyTitle: responseDoc.surveyId.title,
        submittedAt: responseDoc.submittedAt,
        answers: responseDoc.answers,
        questions: questions,
      });
    } catch (error) {
      console.error("Error fetching response details:", error);
      res.status(500).json({ message: "Failed to fetch response details" });
    }
  });
  
  // GET graduation year for student
router.get("/gradyear/:userId", authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.userId);
    if (!student) return res.status(404).json({ message: "User not found" });
    res.json({ gradyear: student.gradyear });
  } catch (error) {
    console.error("Error fetching gradyear:", error);
    res.status(500).json({ message: "Failed to fetch gradyear" });
  }
});

export default router;