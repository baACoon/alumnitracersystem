// Updated surveyroutes.js (Backend Routes)
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Student } from "../record.js"; // Adjust the relative path to record.js


const router = express.Router();

const surveySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  personalInfo: {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    middle_name: { type: String },
    email_address: { type: String, required: true },
    contact_no: { type: String, required: true },
    nationality: { type: String, required: true },
    sex: { type: String, enum: ["Male", "Female"], required: true },
    birthdate: { type: Date, required: true },
    birthplace: { type: String, required: true },
    address: { type: String, required: true },
    degree: {
      type: String,
      enum: ["bachelors", "masters", "doctorate"],
      required: true,
    },
    college: { type: String, required: true },
    course: { type: String, required: true },
  },
  employmentInfo: {
    occupation: { type: String, required: true },
    company_name: { type: String, required: true },
    year_started: { type: Number, required: true },
    position: { type: String, required: true },
    job_status: {
      type: String,
      enum: ["Permanent", "Contractual/Project Based", "Temporary", "Self-employed", "Unemployed"],
      required: true,
    },
    type_of_organization: {
      type: String,
      enum: ["Private", "Government", "NGO", "Self-Employed"],
      required: true,
    },
    work_alignment: {
      type: String,
      enum: [
        "Very much aligned",
        "Aligned",
        "Averagely Aligned",
        "Somehow Aligned",
        "Unaligned",
      ],
      required: true,
    },
  },
}, {
  timestamps: true,
});

const SurveySubmission = mongoose.model("surveys", surveySchema);

// Middleware to authenticate user
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token." });
    }
    req.user = user; // Attach the decoded user info to the request object
    next();
  });
};

// Middleware for validation
const validateSurvey = (req, res, next) => {
  const requiredFields = ["personalInfo", "employmentInfo"];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `${field} is required`,
      });
    }
  }
  next();
};

// Submit survey
router.post("/submit", authenticateToken, validateSurvey, async (req, res) => {
  let userId; // Declare userId outside the try block (Updated to avoid scope issues)
  try {
    const { userId: extractedUserId, ...surveyData } = req.body;
    userId = extractedUserId; // Assign the extracted userId to the outer variable (Updated)

    // Validate that the user exists
    const user = await Student.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }

    const submission = new SurveySubmission({ userId, ...surveyData });
    await submission.save();
    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
    });

    console.log("Survey submitted for user:", userId);
  } catch (error) {
    console.error("Error during survey submission:", error.message);
    console.log("Invalid userId:", userId || "Not provided"); // Updated to log fallback value if userId is undefined
    res.status(500).json({
      success: false,
      message: "Failed to submit survey",
      error: error.message,
    });
  }
});

// Get all submissions (paginated)
router.get("/submissions", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const submissions = await SurveySubmission.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SurveySubmission.countDocuments();

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
      error: error.message,
    });
  }
});

router.get("/user-surveys", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const surveys = await SurveySubmission.find({ userId });
    res.status(200).json({ success: true, data: surveys });
  } catch (error) {
    console.error("Error fetching user surveys:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch surveys.",
      error: error.message,
    });
  }
});

// Get Pending Surveys by User ID
router.get("/pending/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const completedSurveyIds = await SurveySubmission.find({ userId }).distinct('_id');

    // Fetch all surveys available (you could also define available surveys elsewhere in DB)
    const allSurveys = [
      { id: "tracer2024", title: "Tracer Survey Form (2024)", dateReceived: "Feb 15, 2024" },
      { id: "alumniFeedback", title: "Alumni Feedback Survey", dateReceived: "Jan 28, 2024" },
      { id: "postGradEmployment", title: "Post-Graduate Employment Survey", dateReceived: "Mar 3, 2024" },
    ];

    // Return surveys NOT yet submitted by user
    const pendingSurveys = allSurveys.filter(survey => !completedSurveyIds.includes(survey.id));

    res.status(200).json({ surveys: pendingSurveys });
  } catch (error) {
    console.error("Error fetching pending surveys:", error);
    res.status(500).json({ message: "Failed to fetch pending surveys." });
  }
});

// Get Completed Surveys by User ID
router.get("/completed/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const submissions = await SurveySubmission.find({ userId }).sort({ createdAt: -1 });

    // Map submissions to a format frontend expects
    const completedSurveys = submissions.map(survey => ({
      id: survey._id,
      title: "Tracer Survey Form (2024)", // This could be dynamic based on submission
      dateCompleted: survey.createdAt.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }),
    }));

    res.status(200).json({ surveys: completedSurveys });
  } catch (error) {
    console.error("Error fetching completed surveys:", error);
    res.status(500).json({ message: "Failed to fetch completed surveys." });
  }
});


// Get statistics
router.get("/statistics", async (req, res) => {
  try {
    const collegeStats = await SurveySubmission.aggregate([
      {
        $group: {
          _id: "$personalInfo.college",
          count: { $sum: 1 },
          alignments: { $push: "$employmentInfo.work_alignment" },
        },
      },
    ]);

    const jobStatusStats = await SurveySubmission.aggregate([
      {
        $group: {
          _id: "$employmentInfo.job_status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        byCollege: collegeStats,
        byJobStatus: jobStatusStats,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
});

export { SurveySubmission };

export default router;
