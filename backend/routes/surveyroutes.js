// Updated surveyroutes.js (Backend Routes)
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const surveySchema = new mongoose.Schema({
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
      enum: ["Permanent", "Contractual", "Temporary", "Unemployed"],
      required: true,
    },
    type_of_organization: {
      type: String,
      enum: ["Private", "NGO", "Self-Employed"],
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
router.post("/submit", validateSurvey, async (req, res) => {
  try {
    const submission = new SurveySubmission(req.body);
    await submission.save();
    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
    });
  } catch (error) {
    console.error("Survey submission error:", error);
    res.status(400).json({
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



export default router;
