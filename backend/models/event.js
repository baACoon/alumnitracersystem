import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { sendEventNotification } from "../emailservice.js";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Event from "./Eventmodal.js";

const router = express.Router();

// Cloudinary Configuration for Image Uploads
const eventStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'events', // Specify folder name for event images in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Resize images to 500x500
  },
});

const uploadImageEvents = multer({ storage: eventStorage });

// POST: Create a new event with an image
router.post("/create", uploadImageEvents.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log request data
    console.log("Uploaded file:", req.file); // Log uploaded file info

    const { title, description, date, time, venue, source } = req.body;

    if (!title || !description || !date || !time || !venue) {
      console.error("Missing required fields");
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    // Create the new event
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      venue,
      source,
      image: req.file ? req.file.path : null, // Save the Cloudinary URL if uploaded
    });

    // Save event to the database
    await newEvent.save();

    // Send Email Notification to Users
    await sendEventNotification(title, description, date);

    // Send success response after saving event and sending email
    res.status(201).json({
      message: "Event created successfully & notifications sent!",
      event: newEvent,
    });

  } catch (error) {
    console.error("Error creating event:", error); // Log the error
    res.status(500).json({ error: "Failed to create event." });
  }
});

// GET: Fetch all events
router.get("/list", async (req, res) => {
  try {
    const events = await Event.find({}); // Ensure this returns valid data
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events." });
  }
});


// TRASH: Soft delete (move to trash instead of hard delete)
router.post("/soft-delete/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });

    event.isDeleted = true;
    event.deletedAt = new Date();
    await event.save();

    res.status(200).json({ message: "Event moved to trash." });
  } catch (error) {
    console.error("Soft delete error:", error);
    res.status(500).json({ error: "Failed to soft delete event." });
  }
});

// TRASH: Get all events in trash (within 7 days)
router.get("/trash", async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const trashedEvents = await Event.find({
      isDeleted: true,
      deletedAt: { $gte: sevenDaysAgo }
    });
    res.status(200).json(trashedEvents);
  } catch (error) {
    console.error("Fetch trashed events error:", error);
    res.status(500).json({ error: "Failed to fetch trashed events." });
  }
});

// TRASH: Restore event from trash
router.post("/restore/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || !event.isDeleted) return res.status(404).json({ error: "Event not found in trash." });

    event.isDeleted = false;
    event.deletedAt = null;
    await event.save();

    res.status(200).json({ message: "Event restored successfully." });
  } catch (error) {
    console.error("Restore event error:", error);
    res.status(500).json({ error: "Failed to restore event." });
  }
});


export default router;
