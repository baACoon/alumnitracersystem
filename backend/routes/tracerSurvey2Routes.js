import express from "express";
import TracerSurvey2 from "../models/TracerSurvey2.js";
import mongoose from "mongoose";

const router = express.Router();

// POST - Submit Tracer Survey 2
router.post("/submit", async (req, res) => {
  try {
    const { userId, ...surveyData } = req.body;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Create new survey with additional metadata
    const newSurvey = new TracerSurvey2({
      userId,
      ...surveyData,
      surveyType: "Tracer2", // Automatically set
      date: new Date()       // Explicit date capture
    });

    // Validate before saving
    const validationError = newSurvey.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map(e => e.message);
      return res.status(400).json({ 
        error: "Validation failed",
        details: errors 
      });
    }

    await newSurvey.save();
    
    res.status(201).json({ 
      success: true,
      message: "Tracer Survey 2 submitted successfully",
      surveyId: newSurvey._id
    });

  } catch (error) {
    console.error("Error submitting Tracer Survey 2:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        error: "Validation failed",
        details: errors 
      });
    }
    
    res.status(500).json({ 
      error: "Failed to submit Tracer Survey 2",
      details: error.message 
    });
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