import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Graduate from "../models/graduateModels.js";
import Batch from "../models/batch.js";
import { uploadCSV, getGraduates } from "../controllers/uploadcontroller.js";

const router = express.Router();

// Ensure the BatchList folder exists
const uploadDir = path.join(process.cwd(), "BatchList");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV and XLSX files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Multer middleware with error handling
const uploadMiddleware = (req, res, next) => {
  upload.single("csvFile")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "File upload error", details: err.message });
    } else if (err) {
      return res.status(400).json({ error: "File upload failed", details: err.message });
    }
    next();
  });
};

// 📥 Upload CSV
router.post("/BatchList", uploadMiddleware, async (req, res) => {
  try {
    const { gradMonth } = req.body; // Accept gradMonth from the request body

    // Validate gradMonth
    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];

    if (gradMonth && !monthNames.includes(gradMonth.toLowerCase())) {
      return res.status(400).json({
        error: "Invalid gradMonth. Valid values are: " + monthNames.join(", ")
      });
    }

    // Pass gradMonth to the uploadCSV controller
    req.body.gradMonth = gradMonth ? gradMonth.toLowerCase() : null;

    uploadCSV(req, res);
  } catch (error) {
    console.error("Error in BatchList route:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// 📤 Get all graduates (with optional ?year= param)
router.get("/graduates", getGraduates);

// ✅ CREATE batch
router.post("/batches", async (req, res) => {
  const { year, title } = req.body;
  if (!year || !title) {
    return res.status(400).json({ error: "Year and title are required" });
  }

  try {
    const exists = await Batch.findOne({ year });
    if (exists) {
      return res.status(400).json({ error: "Batch already exists" });
    }

    const batch = new Batch({ year, title, importedDate: null });
    await batch.save();
    res.status(201).json({ message: "Batch created successfully", batch });
  } catch (err) {
    console.error("Failed to create batch:", err);
    res.status(500).json({ error: "Failed to save batch" });
  }
});

// ✅ GET all batches
router.get("/batches", async (req, res) => {
  try {
    const batches = await Batch.find().sort({ year: -1 });
    res.json(batches);
  } catch (err) {
    console.error("Error fetching batches:", err);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
});

// ✅ DELETE batch and its graduates
router.delete("/graduates/batch/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const gradResult = await Graduate.deleteMany({ gradYear: parseInt(year) });
    const batchResult = await Batch.deleteOne({ year: parseInt(year) });

    res.json({
      message: `Deleted batch ${year} with ${gradResult.deletedCount} graduates.`,
      deletedGraduates: gradResult.deletedCount,
      deletedBatch: batchResult.deletedCount
    });
  } catch (err) {
    console.error("Failed to delete batch:", err);
    res.status(500).json({ error: "Failed to delete batch" });
  }
});

export default router;