import express from "express";
import { SurveySubmission } from "./surveyroutes.js";
import TracerSurvey2 from "../models/TracerSurvey2.js";

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

// tracer 2 apis
router.get("/tracer2/analytics", async (req, res) => {
  try {
    const submissions = await TracerSurvey2.find({ version: 2 });

    // 1. Total Respondents
    const totalRespondents = submissions.length;

    const totalEmployed = submissions.filter(entry => {
      const status = (entry.job_status || "").toLowerCase().trim();
      return status && status !== "unemployed";
    }).length;
    
    

    // 2. Advanced Degree Holders (Masteral / Doctorate)
    const advancedDegreeHolders = { masters: 0, doctorate: 0 };

    submissions.forEach(entry => {
      (entry.education || []).forEach(edu => {
        (edu.degreeType || []).forEach(type => {
          const lower = type.toLowerCase();
          if (lower.includes("master")) advancedDegreeHolders.masters++;
          if (lower.includes("doctor") || lower.includes("phd")) advancedDegreeHolders.doctorate++;
        });
      });
    });


    // 3. Reasons for Taking Course
    const reasons = {};
    submissions.forEach(entry => {
      for (const [key, obj] of Object.entries(entry.reasons || {})) {
        if (!reasons[key]) reasons[key] = { undergraduate: 0, graduate: 0 };
        if (obj.undergraduate) reasons[key].undergraduate++;
        if (obj.graduate) reasons[key].graduate++;
      }
    });

    // 4. Employment Status
    const job_status = {};
    submissions.forEach(entry => {
      const raw = (entry.job_status || "").trim().toLowerCase();
      const normalized = raw || "Unemployed";
      const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
      job_status[label] = (job_status[label] || 0) + 1;
    });

    // 5–11. Job Details (if employed)
    const jobData = {
      lineOfBusiness: {},
      placeOfWork: {},
      firstJobDuration: {},
      firstJobSearch: {},
      jobLandingTime: {},
      position: {},
      work_alignment: {},
      coreCompetencies: {}
    };

    submissions.forEach(entry => {
      const job = entry.jobDetails || {};

      if (entry.job_status !== "unemployed") {
        const count = (field, value) => {
          if (value) jobData[field][value] = (jobData[field][value] || 0) + 1;
        };

        count("lineOfBusiness", job.lineOfBusiness);
        count("placeOfWork", job.placeOfWork);
        count("firstJobDuration", job.firstJobDuration);
        count("jobLandingTime", job.jobLandingTime);
        count("position", job.position);
        count("work_alignment", job.work_alignment);

        // First Job Search (multi-checkbox)
        Object.entries(job.firstJobSearch || {}).forEach(([key, val]) => {
          if (val) jobData.firstJobSearch[key] = (jobData.firstJobSearch[key] || 0) + 1;
        });

        // Core Competencies (multi-checkbox)
        Object.entries(job.competencies || {}).forEach(([key, val]) => {
          if (val) jobData.coreCompetencies[key] = (jobData.coreCompetencies[key] || 0) + 1;
        });
      }
    });

    res.json({
      totalRespondents,
      totalEmployed,
      advancedDegreeHolders,
      reasons,
      job_status,
      jobData
    });
  } catch (err) {
    console.error("Error generating tracer2 analytics:", err);
    res.status(500).json({ error: "Failed to generate analytics." });
  }
});
router.get("/tracer/comparison", async (req, res) => {
  try {
    const tracer1Submissions = await SurveySubmission.find({ surveyType: "Tracer1" });
    const tracer2Submissions = await TracerSurvey2.find({ version: 2 });

    const tracer1Map = new Map();
    tracer1Submissions.forEach((doc) => {
      tracer1Map.set(doc.userId.toString(), doc);
    });

    const usersWithBoth = tracer2Submissions.filter((doc) => tracer1Map.has(doc.userId.toString()));

    let employmentRate = {
      tracer1: { Employed: 0, Unemployed: 0 },
      tracer2: { Employed: 0, Unemployed: 0 },
    };

    let curriculumAlignment = {
      tracer1: {},
      tracer2: {},
    };

    let job_level = {
      tracer1: {},
      tracer2: {}
    };
    
    let jobLevelCount1 = 0;
    let jobLevelCount2 = 0;

    usersWithBoth.forEach((tracer2Doc) => {
      const userId = tracer2Doc.userId.toString();
      const tracer1Doc = tracer1Map.get(userId);

      const employedTypes = ["Permanent", "Contractual/ProjectBased", "Temporary", "Self-employed"];

      const emp1 = tracer1Doc.employmentInfo?.job_status || "Unemployed";
      const emp2 = tracer2Doc.job_status || "Unemployed";

      const isEmp1 = employedTypes.includes(emp1);
      const isEmp2 = employedTypes.includes(emp2);

      employmentRate.tracer1[isEmp1 ? "Employed" : "Unemployed"]++;
      employmentRate.tracer2[isEmp2 ? "Employed" : "Unemployed"]++;

      const align1 = tracer1Doc.employmentInfo?.work_alignment?.trim() || "Unknown";
      const align2 = tracer2Doc.jobDetails?.work_alignment?.trim() || "Unknown";

      curriculumAlignment.tracer1[align1] = (curriculumAlignment.tracer1[align1] || 0) + 1;
      curriculumAlignment.tracer2[align2] = (curriculumAlignment.tracer2[align2] || 0) + 1;

       // Tracer 1 job level (ignore NotApplicable)
      const level1 = tracer1Doc.employmentInfo?.job_level;
      if (level1 && level1 !== "NotApplicable") {
        job_level.tracer1[level1] = (job_level.tracer1[level1] || 0) + 1;
        jobLevelCount1++;
      }

      // Tracer 2 job level (only if available)
      const level2 = tracer2Doc.jobDetails?.job_level;
      if (level2) {
        job_level.tracer2[level2] = (job_level.tracer2[level2] || 0) + 1;
        jobLevelCount2++;
  }
    });

    const toPercent = (obj) => {
      const sum = Object.values(obj).reduce((a, b) => a + b, 0) || 1;
      const percent = {};
      for (let key in obj) {
        percent[key] = Math.round((obj[key] / sum) * 100);
      }
      return percent;
    };

    const toPercentJob = (obj, total) => {
      const percent = {};
      for (let key in obj) {
        percent[key] = total ? Math.round((obj[key] / total) * 100) : 0;
      }
      return percent;
    };

    res.json({
      employmentRate: {
        tracer1: toPercent(employmentRate.tracer1),
        tracer2: toPercent(employmentRate.tracer2),
      },
      curriculumAlignment: {
        tracer1: toPercent(curriculumAlignment.tracer1),
        tracer2: toPercent(curriculumAlignment.tracer2),
      },
      job_level: {
        tracer1: toPercent(job_level.tracer1, jobLevelCount1),
        tracer2: toPercent(job_level.tracer2, jobLevelCount2),
      },
      
    });
  } catch (err) {
    console.error("/tracer/comparison error", err);
    res.status(500).json({ error: "Failed to generate comparison." });
  }
});
  
  export default router;