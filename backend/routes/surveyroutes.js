import express from "express";
import Survey from "../models/survey.js"; // Import survey model

const router = express.Router();

// POST: Create a new survey
router.post("/submit", async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    await newSurvey.save();
    res.status(201).json({ message: "Survey submitted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Retrieve all surveys
router.get("/", async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
