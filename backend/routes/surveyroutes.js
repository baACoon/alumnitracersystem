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
    employmentInfo: { 
      type: mongoose.Schema.Types.Mixed, 
      required: true,
      validate: {
        validator: function(info) {
          if (info.job_status !== 'Unemployed') {
            return info.startedMonth && 
                   ['january', 'february', 'march', 'april', 'may', 'june', 
                    'july', 'august', 'september', 'october', 'november', 'december']
                   .includes(info.startedMonth.toLowerCase());
          }
          return true;
        },
        message: 'Work started month is required and must be a valid month for employed alumni'
      }
    },
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

// Modify the submit route to handle employment status
router.post("/submit/:surveyType", authenticateToken, async (req, res) => {
  const { surveyType } = req.params;
  const userId = req.body.userId;

  try {
    if (!Object.values(surveyTypes).includes(surveyType)) {
      return res.status(400).json({ message: "Invalid survey type." });
    }

    const userExists = await Student.findById(userId);
    if (!userExists) {
      return res.status(400).json({ message: "User not found." });
    }

    // Validate gradmonths if employed
    if (req.body.employmentInfo?.job_status !== 'Unemployed') {
      if (!req.body.employmentInfo?.startedMonth) {
        return res.status(400).json({ 
          message: "Work started month is required for employed alumni" 
        });
      }

      req.body.employmentInfo.startedMonth = req.body.employmentInfo.startedMonth.toLowerCase();
    }

    // Create the submission
    const submission = new SurveySubmission({ 
      userId, 
      surveyType, 
      ...req.body,
      status: req.body.employmentInfo?.job_status === 'Unemployed' ? 'pending' : 'completed'
    });
    
    await submission.save();

    res.status(201).json({ 
      success: true, 
      message: `Survey ${surveyType} submitted successfully`,
      status: submission.status
    });
  } catch (error) {
    console.error("Survey submission error:", error);
    res.status(500).json({ 
      message: "Failed to submit survey",
      error: error.message 
    });
  }
});

// Update the pending route to include survey ID
router.get("/pending/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('🔍 Checking pending surveys for user:', userId);
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: "Invalid user ID format",
        providedId: userId 
      });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // Get latest Tracer1 submission
    const latestTracer1 = await SurveySubmission.findOne({ 
      userId: objectId,
      surveyType: "Tracer1",
      'employmentInfo.job_status': 'Unemployed'
    }).sort({ createdAt: -1 });

    console.log('📋 Found unemployed submission:', !!latestTracer1);

    const pendingSurveys = [];
    if (latestTracer1) {
      pendingSurveys.push({
        id: latestTracer1._id, // Use actual MongoDB ObjectId
        title: "Update Employment Status",
        type: "required",
        status: "Pending Update",
        lastUpdated: latestTracer1.updatedAt
      });
    }

    return res.status(200).json({
      success: true,
      surveys: pendingSurveys
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
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

//MISPLACED API BuT WORKING (USED IN COMPLETED SURVEY)
// ✅ View Single Tracer 1 Survey by ID
router.get("/view/:submissionId", authenticateToken, async (req, res) => {
  try {
    const { submissionId } = req.params;

    const survey = await SurveySubmission.findById(submissionId);

    if (!survey) {
      return res.status(404).json({ message: "Tracer 1 survey not found" });
    }

    res.json(survey);
  } catch (error) {
    console.error("Error fetching Tracer 1 survey details:", error);
    res.status(500).json({ message: "Failed to fetch Tracer 1 survey details" });
  }
});

// Get Tracer 2 survey for a user
router.get("/tracer2/:userId", authenticateToken, async (req, res) => {
  try {
      const { userId } = req.params;
      const survey = await TracerSurvey2.findOne({ userId });
      if (!survey) return res.status(404).json({ message: "Tracer 2 survey not found" });
      res.json(survey);
  } catch (error) {
      console.error("Error fetching Tracer 2 survey:", error);
      res.status(500).json({ message: "Failed to fetch Tracer 2 survey" });
  }
});

// Get Tracer 2 survey details by ID
router.get("/tracer2/details/:id", authenticateToken, async (req, res) => {
  try {
      const { id } = req.params;
      const survey = await TracerSurvey2.findById(id);
      if (!survey) return res.status(404).json({ message: "Tracer 2 survey not found" });
      res.json(survey);
  } catch (error) {
      console.error("Error fetching Tracer 2 survey details:", error);
      res.status(500).json({ message: "Failed to fetch Tracer 2 survey details" });
  }
}); 

// Get ALL Tracer 2 surveys (all versions) for a user
router.get("/tracer2/all/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const objectId = new mongoose.Types.ObjectId(userId);

    const surveys = await TracerSurvey2.find({ userId: objectId }).sort({ createdAt: -1 });

    // ✅ EVEN if no surveys, return 200 OK
    res.json({ surveys });
    
  } catch (error) {
    console.error("Error fetching all Tracer 2 surveys:", error);
    res.status(500).json({ message: "Failed to fetch all Tracer 2 surveys" });
  }
});

// Add this new route for updating employment status
router.patch("/update-employment/:surveyId", authenticateToken, async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { employmentInfo } = req.body;

    // Validate gradmonths if employed
    if (employmentInfo.job_status !== 'Unemployed') {
      if (!employmentInfo.startedMonth) {
        return res.status(400).json({ 
          message: "Work started month is required for employed alumni" 
        });
      }

      const validMonths = ['january', 'february', 'march', 'april', 'may', 'june', 
                          'july', 'august', 'september', 'october', 'november', 'december'];
      
      if (!validMonths.includes(employmentInfo.startedMonth.toLowerCase())) {
        return res.status(400).json({ 
          message: "Invalid work started month",
          validMonths
        });
      }
    }

    // Find and update the existing survey
    const updatedSurvey = await SurveySubmission.findByIdAndUpdate(
      surveyId,
      {
        $set: {
          'employmentInfo': {
            ...employmentInfo,
            startedMonth: employmentInfo.job_status !== 'Unemployed' 
              ? employmentInfo.startedMonth.toLowerCase() 
              : undefined
          },
          'status': employmentInfo.job_status === 'Unemployed' ? 'pending' : 'completed',
          'updatedAt': new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedSurvey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employment status updated successfully",
      survey: updatedSurvey
    });

  } catch (error) {
    console.error("Employment update error:", error);
    res.status(500).json({ 
      message: "Failed to update employment status",
      error: error.message 
    });
  }
});

export default router;