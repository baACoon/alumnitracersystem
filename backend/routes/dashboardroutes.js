import express from "express";
import { SurveySubmission } from "./surveyroutes.js";

const router = express.Router();

//// Get total registered alumni (who submitted surveys)
router.get("/total-alumni", async (req, res) => {
    try {
      const totalAlumni = await SurveySubmission.countDocuments();
      res.json({ success: true, totalAlumni });
    } catch (error) {
      console.error("Error fetching total alumni:", error);
      res.status(500).json({ success: false, message: "Failed to fetch total alumni." });
    }
  });
  
  // Get total employed alumni
  router.get("/employed-alumni", async (req, res) => {
    try {
      const employedAlumni = await SurveySubmission.countDocuments({
        "employmentInfo.job_status": { $nin: ["Unemployed"] }
      });
      res.json({ success: true, employedAlumni });
    } catch (error) {
      console.error("Error fetching employed alumni:", error);
      res.status(500).json({ success: false, message: "Failed to fetch employed alumni." });
    }
  });
  
  // Get total course-aligned alumni
  router.get("/course-aligned-alumni", async (req, res) => {
    try {
      const alignedAlumni = await SurveySubmission.countDocuments({
        "employmentInfo.work_alignment": { $in: ["Very much aligned", "Aligned"] }
      });
      res.json({ success: true, alignedAlumni });
    } catch (error) {
      console.error("Error fetching course-aligned alumni:", error);
      res.status(500).json({ success: false, message: "Failed to fetch course-aligned alumni." });
    }
  });
  
  // Get list of alumni with employment details
  router.get("/alumni-list", async (req, res) => {
    try {
      const alumni = await SurveySubmission.find().select("personalInfo employmentInfo");
      res.json({ success: true, alumni });
    } catch (error) {
      console.error("Error fetching alumni list:", error);
      res.status(500).json({ success: false, message: "Failed to fetch alumni list." });
    }
  });

  
  // tracer 1 apis
  // Comprehensive analytics endpoint for Tracer1 dashboard
router.get("/tracer1-analytics", async (req, res) => {
  try {
    // 1. Get total respondents count
    const respondentCount = await SurveySubmission.countDocuments();

    // 2. Get degree distribution
    const degreeData = await SurveySubmission.aggregate([
      { $group: { _id: "$personalInfo.degree", count: { $sum: 1 } } },
      { $project: { name: { 
          $switch: {
            branches: [
              { case: { $eq: ["$_id", "bachelors"] }, then: "Bachelor's" },
              { case: { $eq: ["$_id", "masters"] }, then: "Master's" },
              { case: { $eq: ["$_id", "doctorate"] }, then: "Doctorate" }
            ],
            default: "Other"
          }
        }, value: "$count", _id: 0 } 
      }
    ]);

    // 3. Get college distribution
    const collegeData = await SurveySubmission.aggregate([
      { $group: { _id: "$personalInfo.college", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } },
      { $sort: { value: -1 } }
    ]);

    // 4. Get year started distribution
    const yearStartedData = await SurveySubmission.aggregate([
      { $group: { _id: "$employmentInfo.year_started", count: { $sum: 1 } } },
      { $project: { name: { $toString: "$_id" }, value: "$count", _id: 0 } },
      { $sort: { name: 1 } }
    ]);

    // 5. Get employment status distribution
    const employmentStatusData = await SurveySubmission.aggregate([
      { $group: { _id: "$employmentInfo.job_status", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    // 6. Get organization type distribution
    const organizationTypeData = await SurveySubmission.aggregate([
      { $group: { _id: "$employmentInfo.type_of_organization", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    // 7. Get work alignment distribution
    const workAlignmentData = await SurveySubmission.aggregate([
      { $group: { _id: "$employmentInfo.work_alignment", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    res.json({
      success: true,
      data: {
        respondentCount,
        degreeData,
        collegeData,
        yearStartedData,
        employmentStatusData,
        organizationTypeData,
        workAlignmentData
      }
    });

  } catch (error) {
    console.error("Error fetching tracer1 analytics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics data." });
  }
});
  
  export default router;