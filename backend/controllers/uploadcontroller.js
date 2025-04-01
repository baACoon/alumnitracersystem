import Graduate from "../models/graduateModels.js";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";

// Ensure BatchList directory exists
const ensureBatchListDirectoryExists = () => {
  const batchListDir = path.join(process.cwd(), "BatchList");

  if (!fs.existsSync(batchListDir)) {
    console.log("Creating BatchList directory for CSV uploads");
    fs.mkdirSync(batchListDir, { recursive: true });
  }
};

export const uploadCSV = async (req, res) => {
  try {
    ensureBatchListDirectoryExists();

    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

     // ✅ Define filePath correctly
     const filePath = req.file.path;
     console.log("📂 File received:", filePath);

     const results = [];
     let isFirstRow = true;  // ✅ Declare isFirstRow properly

    fs.createReadStream(filePath, { encoding: "utf8" })
    .pipe(csvParser())
    .on("data", (row) => {
        // ✅ Skip first row if it's a duplicate header
        if (isFirstRow && row["Last Name"] === "Last Name") {
            console.log("⚠️ Skipping duplicate header row...");
            isFirstRow = false;
            return;
        }

        // ✅ Ensure required fields are not empty
        if (!row["Last Name"] || !row["First Name"] || !row["Year Graduated"]) {
            console.warn("⚠️ Skipping row due to missing required fields:", row);
            return;
        }

        // ✅ Build graduate object
        const graduate = {
            lastName: row["Last Name"].trim(),
            firstName: row["First Name"].trim(),
            middleName: row["Middle Initial"] ? row["Middle Initial"].trim() : "N/A",
            contact: row["Contact No."] ? row["Contact No."].trim() : "N/A",
            email: row["Email"] ? row["Email"].trim() : "N/A",
            college: row["College"] ? row["College"].trim() : "Unknown",
            course: row["Course"] ? row["Course"].trim() : "Unknown",
            gradYear: row["Year Graduated"] ? parseInt(row["Year Graduated"].trim()) : null
        };

        // ✅ Validate graduation year
        if (isNaN(graduate.gradYear)) {
            console.warn("⚠️ Skipping row due to invalid graduation year:", graduate);
            return;
        }

        results.push(graduate);
      })
      .on("end", async () => {
        try {
          console.log("✅ CSV parsing complete. Preparing to insert data...");

          if (results.length === 0) {
            console.warn("⚠️ No valid graduates found to insert. Check CSV column names.");
            return res.status(400).json({ error: "No valid graduates found. Ensure correct CSV format." });
          }

          await Graduate.insertMany(results);
          console.log(`✅ Successfully inserted ${results.length} records into MongoDB`);

          // ✅ Delete the file after processing
          fs.unlinkSync(req.file.path);

          res.json({
            message: "Upload successful",
            count: results.length,
            data: results,
          });
        } catch (err) {
          console.error("❌ Error inserting data into MongoDB:", err);
          res.status(500).json({
            error: "Error inserting data into MongoDB",
            details: err.message,
          });
        }
      })
      .on("error", (error) => {
        console.error("❌ Error parsing CSV:", error);
        res.status(500).json({ error: "Error parsing CSV file", details: error.message });
      });
  } catch (err) {
    console.error("❌ Unexpected error in upload:", err);
    res.status(500).json({ error: "Server error during upload", details: err.message });
  }
};

// ✅ Fetch all graduates
export const getGraduates = async (req, res) => {
    try {
        const graduates = await Graduate.find().sort({ gradYear: -1 });  // ✅ Ensures latest records first
        console.log("✅ Returning graduates:", graduates.length);
        res.json(graduates);
    } catch (err) {
        console.error("❌ Error retrieving graduates:", err);
        res.status(500).json({ error: "Error retrieving data", details: err.message });
    }
};
