import express from "express";
import TracerSurvey2 from "../models/TracerSurvey2.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/user-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // FIXED: convert string to ObjectId before query
    const hasTracer2 = await TracerSurvey2.exists({ userId: new mongoose.Types.ObjectId(userId) });

    res.json({
      status: {
        tracer2Completed: !!hasTracer2
      }
    });
  } catch (err) {
    console.error("Error checking Tracer 2 status:", err);
    res.status(500).json({ error: "Failed to check Tracer 2 completion" });
  }
});




// POST - Submit Tracer Survey 2
router.post("/tracerSurvey2/submit", async (req, res) => {
  try {
    const { userId, ...surveyData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
        details: `Received: ${userId}`
      });
    }

    // 🧠 Fetch most recent version for user
    const latestSubmission = await TracerSurvey2.find({ userId }).sort({ version: -1 }).limit(1);
    const newVersion = latestSubmission.length > 0
      ? latestSubmission[0].version + 1
      : 2;

    const newSurvey = new TracerSurvey2({
      userId,
      version: newVersion,
      ...surveyData
    });

    await newSurvey.save();

    res.status(201).json({
      success: true,
      message: `Tracer Survey v${newVersion} submitted successfully.`,
      version: newVersion
    });
  } catch (err) {
    console.error("Tracer Survey Submission Error:", err);
    res.status(500).json({ error: "Failed to submit survey.", details: err.message });
  }
});

// routes/tracerSurvey2Routes.js
router.get("/api/tracer2/latest/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const latest = await TracerSurvey2.find({ userId })
      .sort({ version: -1 })
      .limit(1);

    const latestVersion = latest.length ? latest[0].version : 1;
    const latestDate = latest.length ? new Date(latest[0].createdAt) : new Date();

    const nextReleaseDate = new Date(latestDate);
    nextReleaseDate.setFullYear(nextReleaseDate.getFullYear() + 2);

    res.json({
      nextVersion: latestVersion + 1,
      releaseDate: nextReleaseDate,
      eligible: new Date() >= nextReleaseDate
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch latest tracer info." });
  }
});


// GET - Fetch all submissions with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const query = {};

    // Filter by userId if provided
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }
      query.userId = userId;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'userId',
        select: 'firstName lastName email' // Example fields to populate
      }
    };

    const result = await TracerSurvey2.paginate(query, options);

    res.status(200).json({
      success: true,
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      pages: result.totalPages
    });

  } catch (error) {
    console.error("Error fetching Tracer 2 data:", error);
    res.status(500).json({ 
      error: "Failed to fetch Tracer 2 data",
      details: error.message 
    });
  }
});

// GET - Fetch single submission by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid survey ID format" });
    }

    const survey = await TracerSurvey2.findById(id).populate('userId');

    if (!survey) {
      return res.status(404).json({ error: "Survey not found" });
    }

    res.status(200).json(survey);

  } catch (error) {
    console.error("Error fetching survey:", error);
    res.status(500).json({ 
      error: "Failed to fetch survey",
      details: error.message 
    });
  }
});

export default router;