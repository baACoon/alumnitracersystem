import express from "express";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import Response from "../models/surveyModels/Response.js";
import CreatedSurvey from "../models/surveyModels/CreatedSurvey.js";
import Question from "../models/surveyModels/Questions.js";
import TracerSurvey2 from "../models/TracerSurvey2.js";
import { SurveySubmission } from "../routes/surveyroutes.js";

const router = express.Router();

// Enhanced: GET /surveys/reports - Includes Tracer1, Tracer2, and created surveys
router.get("/reports", async (req, res) => {
  try {
    // 1. Tracer 1
    const tracer1 = await SurveySubmission.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "userId",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      { $match: { surveyType: "Tracer1" } },
      {
        $group: {
          _id: { gradyear: "$studentInfo.gradyear", tracer: "$surveyType" },
          responses: { $sum: 1 },
          date: { $max: "$createdAt" }
        }
      },
      {
        $project: {
          batch: "$_id.gradyear",
          tracer1: "$_id.tracer",
          tracer2: null,
          customSurvey: null,
          version: null,
          responses: 1,
          date: 1
        }
      }
    ]);

    // 2. Tracer 2
    const tracer2 = await TracerSurvey2.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "userId",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      {
        $group: {
          _id: {
            gradyear: "$studentInfo.gradyear",
            tracer: "$surveyType",
            version: "$version"
          },
          responses: { $sum: 1 },
          date: { $max: "$createdAt" }
        }
      },
      {
        $project: {
          batch: "$_id.gradyear",
          tracer1: null,
          tracer2: "$_id.tracer",
          customSurvey: null,
          version: "$_id.version",
          responses: 1,
          date: 1
        }
      }
    ]);

    // 3. Custom Created Surveys
    const customSurveys = await Response.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "userId",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      {
        $lookup: {
          from: "createdsurveys",
          localField: "surveyId",
          foreignField: "_id",
          as: "surveyInfo"
        }
      },
      { $unwind: "$surveyInfo" },
      {
        $group: {
          _id: {
            gradyear: "$studentInfo.gradyear",
            title: "$surveyInfo.title"
          },
          responses: { $sum: 1 },
          date: { $max: "$dateCompleted" }
        }
      },
      {
        $project: {
          batch: "$_id.gradyear",
          tracer1: null,
          tracer2: null,
          customSurvey: "$_id.title",
          version: null,
          responses: 1,
          date: 1
        }
      }
    ]);

    // Combine and unify all data
    const allReports = [...tracer1, ...tracer2, ...customSurveys].map((item, i) => ({
      id: i + 1,
      batch: item.batch,
      tracer1: item.tracer1,
      tracer2: item.tracer2,
      customSurvey: item.customSurvey,
      version: item.version,
      responses: item.responses,
      date: new Date(item.date).toISOString().split("T")[0]
    }));

    res.json({ reports: allReports });
  } catch (err) {
    console.error("Error generating reports:", err);
    res.status(500).json({ message: "Failed to generate reports" });
  }
});

router.get("/export/:surveyType", async (req, res) => {
  const { surveyType } = req.params;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Survey Export");

  const exportDir = path.join("exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }
  const tempPath = path.join("exports", `survey-${surveyType}.xlsx`);

  if (!fs.existsSync("exports")) {
    fs.mkdirSync("exports");
  }
  
  await workbook.xlsx.writeFile(tempPath);
  res.download(tempPath, (err) => {
    if (!err) fs.unlinkSync(tempPath);
  });
  
  try {
    if (surveyType === "Tracer1") {
      const tracer1 = await SurveySubmission.find({ surveyType: "Tracer1" }).populate("userId");
      worksheet.columns = [
        { header: "Name", key: "name" },
        { header: "Batch", key: "batch" },
        { header: "Occupation", key: "occupation" },
        { header: "Company", key: "company" },
        { header: "Position", key: "position" },
      ];

      tracer1.forEach(entry => {
        worksheet.addRow({
          name: `${entry.personalInfo?.first_name || ""} ${entry.personalInfo?.last_name || ""}`,
          batch: entry.userId?.gradyear || "",
          occupation: entry.employmentInfo?.occupation || "",
          company: entry.employmentInfo?.company_name || "",
          position: entry.employmentInfo?.position || "",
        });
      });

    } else if (surveyType === "Tracer2") {
      const tracer2 = await TracerSurvey2.find().populate("userId");
      worksheet.columns = [
        { header: "Batch", key: "batch" },
        { header: "Occupation", key: "occupation" },
        { header: "Company", key: "company" },
        { header: "Position", key: "position" },
        { header: "Work Alignment", key: "work_alignment" },
      ];

      tracer2.forEach(entry => {
        worksheet.addRow({
          batch: entry.userId?.gradyear || "",
          occupation: entry.jobDetails?.occupation || "",
          company: entry.jobDetails?.company_name || "",
          position: entry.jobDetails?.position || "",
          work_alignment: entry.jobDetails?.work_alignment || "",
        });
      });

    } else {
      // CUSTOM SURVEY EXPORT
      const survey = await CreatedSurvey.findOne({ title: surveyType });
      if (!survey) return res.status(404).json({ message: "Survey not found." });

      const questions = await Question.find({ surveyId: survey._id });
      const responses = await Response.find({ surveyId: survey._id }).populate("userId");

      // Add dynamic headers
      const headers = [
        { header: "User ID", key: "user" },
        ...questions.map((q, i) => ({
          header: q.questionText,
          key: `q${i}`
        }))
      ];
      worksheet.columns = headers;

      responses.forEach(res => {
        const row = { user: res.userId?.generatedID || "N/A" };
        res.answers.forEach((ans, i) => {
          row[`q${i}`] = ans.response;
        });
        worksheet.addRow(row);
      });
    }

    const tempPath = path.join("exports", `survey-${surveyType}.xlsx`);
    await workbook.xlsx.writeFile(tempPath);
    res.download(tempPath, err => {
      if (!err) fs.unlinkSync(tempPath); // delete after sending
    });

  } catch (error) {
    console.error("❌ Export error:", error.message, error.stack);
    res.status(500).json({ message: "Failed to export.", error: error.message });
  }
  
});
  
export default router;