import express from "express";
import TracerSurvey2 from "../models/TracerSurvey2.js";
import mongoose from "mongoose";

const router = express.Router();

// POST - Submit Tracer Survey 2
router.post("/submit", async (req, res) => {
  try {
    // Add payload logging
    console.log("Raw incoming payload:", req.body);
    
    const { userId, ...surveyData } = req.body;

    // Enhanced validation
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        error: "Invalid user ID",
        details: `Received: ${userId}` 
      });
    }
    

    // Check required array fields
    if (!surveyData.education?.length || !surveyData.trainings?.length) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "Education and trainings arrays cannot be empty"
      });
    }

    const newSurvey = new TracerSurvey2({
      userId,
      ...surveyData,
      surveyType: "Tracer2",
      date: new Date()
    });

    // Explicit validation
    const validationError = newSurvey.validateSync();
    if (validationError) {
      const errors = {};
      Object.keys(validationError.errors).forEach(key => {
        errors[key] = validationError.errors[key].message;
      });
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }

    const savedSurvey = await newSurvey.save();
    
    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
      surveyId: savedSurvey._id,
      timestamp: savedSurvey.createdAt
    });

  } catch (error) {
    console.error("Full error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }
    
    res.status(500).json({
      error: "Server error",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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