import Graduate from "../models/graduateModels.js";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";

// Double the directory checks with redundancy
const ensureBatchListDirectoryExists = () => {
  const batchListDir = path.join(process.cwd(), "BatchList");
  if (!fs.existsSync(batchListDir)) {
    fs.mkdirSync(batchListDir, { recursive: true });
  }
};

// Enhanced validation with duplicate checks
const validateCollegeAndCourse = (college, course) => {
  // Double validation for college
  if (college && typeof college === 'string' && college.trim() !== '') {
    // Additional check for suspicious characters
    if (/[<>]/.test(college)) {
      console.warn(`⚠️ Suspicious characters in college: ${college}`);
      return false;
    }
    return true;
  }
  
  // Double validation for empty/invalid college
  if (college !== null && (typeof college !== 'string' || college.trim() === '')) {
    console.warn(`⚠️ Invalid college format (double-checked): ${college}`);
    return false;
  }
  
  return true;
};

// Strict validation with detailed error reporting
const validateFields = (row) => {
  const errors = [];

  ["Last Name", "First Name", "Year Graduated"].forEach((field) => {
    if (!row[field]?.trim()) errors.push(`Missing ${field}`);
  });

  const gradYear = parseInt(row["Year Graduated"]?.trim());
  if (isNaN(gradYear)) errors.push("Invalid graduation year");

  if (row["Email"] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row["Email"].trim())) {
    errors.push("Invalid email format");
  }

  if (row["TUP-ID"] && !/^[A-Z0-9-]{8,}$/i.test(row["TUP-ID"].trim())) {
    errors.push("Invalid TUP-ID format");
  }

  return errors.length > 0 ? errors : null;
};

export const uploadCSV = async (req, res) => {
  try {
    ensureBatchListDirectoryExists();

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const batchYear = Number(req.body.batchYear) || new Date().getFullYear();

    const results = [];
    const validationErrors = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        if (row["Last Name"] === "Last Name") return;

        const fieldErrors = validateFields(row);
        if (fieldErrors) {
          validationErrors.push({ row, errors: fieldErrors });
          return;
        }

        results.push({
          lastName: row["Last Name"].trim(),
          firstName: row["First Name"].trim(),
          middleName: row["Middle Initial"]?.trim() || "",
          contact: row["Contact No."]?.trim() || null,
          email: row["Email"]?.trim().toLowerCase() || "",
          college: row["College"]?.trim().toUpperCase() || "",
          course: row["Course"]?.trim().toUpperCase() || "",
          gradYear: batchYear,
          importedDate: new Date()
        });
      })
      .on("end", async () => {
        try {
          if (!results.length) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: "No valid data found", validationErrors });
          }

          // 🔍 Step 1: Fetch all existing entries for that year
          const existingGrads = await Graduate.find({ gradYear: batchYear });

          // 🔑 Step 2: Create a normalized map of existing entries
          const existingMap = new Set(
            existingGrads.map((g) =>
              [
                g.firstName.trim().toLowerCase(),
                g.lastName.trim().toLowerCase(),
                g.middleName.trim().toLowerCase(),
                g.email.trim().toLowerCase(),
                g.college?.trim().toUpperCase() || "",
                g.course?.trim().toUpperCase() || ""
              ].join("|")
            )
          );

          // ✅ Step 3: Filter out duplicates
          const filteredResults = results.filter((grad) => {
            const key = [
              grad.firstName.trim().toLowerCase(),
              grad.lastName.trim().toLowerCase(),
              grad.middleName.trim().toLowerCase(),
              grad.email.trim().toLowerCase(),
              grad.college.trim().toUpperCase(),
              grad.course.trim().toUpperCase()
            ].join("|");

            return !existingMap.has(key);
          });

          let insertedDocs = [];
          if (filteredResults.length > 0) {
            insertedDocs = await Graduate.insertMany(filteredResults, { ordered: false });
          }

          const dbCount = await Graduate.countDocuments({ gradYear: batchYear });
          fs.unlinkSync(filePath);

          res.json({
            success: true,
            stats: {
              attempted: results.length,
              inserted: insertedDocs.length,
              skipped: results.length - filteredResults.length,
              totalInDB: dbCount
            },
            validationErrors: validationErrors.slice(0, 5)
          });
        } catch (err) {
          fs.unlinkSync(filePath);
          res.status(500).json({ error: "Database error", details: err.message });
        }
      })
      .on("error", (error) => {
        fs.unlinkSync(filePath);
        res.status(500).json({ error: "CSV processing error", details: error.message });
      });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const getGraduates = async (req, res) => {
  try {
    const { year } = req.query;
    
    if (!year) {
      return res.status(400).json({
        error: "Year parameter is required",
        example: "/api/graduates?year=2020"
      });
    }

    const filter = { gradYear: parseInt(year) };
    
    // Optional filters
    if (req.query.college) filter.college = req.query.college.toUpperCase();
    if (req.query.course) filter.course = req.query.course.toUpperCase();

    const graduates = await Graduate.find(filter)
      .sort({ lastName: 1, firstName: 1 })
      .select('-__v -_checksum');

    const latest = await Graduate.findOne(filter).sort({ importedDate: -1 });


    res.json({
      count: graduates.length,
      data: graduates
    });
  } catch (err) {
    console.error("Retrieval error:", err);
    res.status(500).json({
      error: "Data retrieval failed",
      details: err.message
    });
  }
};