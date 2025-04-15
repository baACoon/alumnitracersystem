import express from "express";
import TracerSurvey2 from "../models/TracerSurvey2.js";

const router = express.Router();

// POST - submit survey
router.post("/submit", async (req, res) => {
  try {
    const newSurvey = new TracerSurvey2(req.body);
    await newSurvey.save();
    res.status(200).json({ message: "Tracer Survey 2 submitted successfully" });
  } catch (error) {
    console.error("Error submitting Tracer Survey 2:", error);
    res.status(500).json({ error: "Failed to submit Tracer Survey 2" });
  }
});

// GET - fetch all submissions (optional)
router.get("/", async (req, res) => {
  try {
    const all = await TracerSurvey2.find().sort({ createdAt: -1 });
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Tracer 2 data", error });
  }
});

export default router;
