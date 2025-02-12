import express from "express";
import Blacklist from "../models/blacklist.js";

const router = express.Router();

// Add email to blacklist
router.post("/add", async (req, res) => {
  const { email, reason } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    const exists = await Blacklist.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email is already blacklisted." });
    }

    await Blacklist.create({ email, reason });

    res.status(201).json({ success: true, message: "Email added to blacklist." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding email to blacklist.", error: error.message });
  }
});

// Remove email from blacklist
router.delete("/remove", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    const removed = await Blacklist.findOneAndDelete({ email });

    if (!removed) {
      return res.status(404).json({ success: false, message: "Email not found in blacklist." });
    }

    res.status(200).json({ success: true, message: "Email removed from blacklist." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing email from blacklist.", error: error.message });
  }
});

// Check if an email is blacklisted
router.get("/check/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const exists = await Blacklist.findOne({ email });

    if (exists) {
      return res.status(200).json({ success: true, blacklisted: true, message: "Email is blacklisted." });
    }

    res.status(200).json({ success: true, blacklisted: false, message: "Email is not blacklisted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error checking blacklist.", error: error.message });
  }
});

export default router;