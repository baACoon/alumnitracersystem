import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

const router = express.Router();

// MongoDB Schema for Events
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  source: { type: String, required: false },
  image: { type: String, required: false }, // Image filename
});

// MongoDB Model for Events
const Event = mongoose.model("Event", eventSchema);

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure 'uploads/' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// POST: Create a new event with an image
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log request data
    console.log("Uploaded file:", req.file); // Log uploaded file info

    const { title, description, date, time, venue, source } = req.body;

    if (!title || !description || !date || !time || !venue) {
      console.error("Missing required fields");
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      venue,
      source,
      image: req.file ? req.file.filename : null, // Save image filename if uploaded
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully!", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error); // Log the error
    res.status(500).json({ error: "Failed to create event." });
  }
});

// GET: Fetch all events
router.get("/list", async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

export default router;
