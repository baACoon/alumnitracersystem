import express from "express";
import { SurveySubmission } from "./surveyroutes.js";
import TracerSurvey2 from "../models/TracerSurvey2.js";
import { Student } from "../record.js";

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
router.get("/tracer1-analytics", async (req, res) => {
  try {
    const { batch, college, course } = req.query;

    const match = {};

    if (college) match["personalInfo.college"] = college;
    if (course) match["personalInfo.course"] = course;

    // Base pipeline
    const pipeline = [
      {
        $lookup: {
          from: "students", // collection name students
          localField: "userId",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: { path: "$studentInfo", preserveNullAndEmptyArrays: true } },
      { $match: match }
    ];

    // If batch filter is provided, add it
    if (batch) {
      pipeline.push({
        $match: { "studentInfo.gradyear": Number(batch) }
      });
    }

    // 1. Total respondent count
    const respondentCountAggregation = await SurveySubmission.aggregate([
      ...pipeline,
      { $count: "count" }
    ]);
    const respondentCount = respondentCountAggregation.length > 0 ? respondentCountAggregation[0].count : 0;

    // 2. Degree distribution
    const degreeData = await SurveySubmission.aggregate([
      ...pipeline,
      { $group: { _id: "$personalInfo.degree", count: { $sum: 1 } } },
      {
        $project: {
          name: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "bachelors"] }, then: "Bachelor's" },
                { case: { $eq: ["$_id", "masters"] }, then: "Master's" },
                { case: { $eq: ["$_id", "doctorate"] }, then: "Doctorate" }
              ],
              default: "Other"
            }
          },
          value: "$count",
          _id: 0
        }
      }
    ]);

    // 3. College distribution
    const collegeData = await SurveySubmission.aggregate([
      ...pipeline,
      { $group: { _id: "$personalInfo.college", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } },
      { $sort: { value: -1 } }
    ]);

    // 4. Year Started distribution
    const yearStartedData = await SurveySubmission.aggregate([
      ...pipeline,
      { $group: { _id: "$employmentInfo.year_started", count: { $sum: 1 } } },
      { $project: { name: { $toString: "$_id" }, value: "$count", _id: 0 } },
      { $sort: { name: 1 } }
    ]);

    // 5. Employment Status distribution
    const employmentStatusData = await SurveySubmission.aggregate([
      ...pipeline,
      { $group: { _id: "$employmentInfo.job_status", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    // 6. Organization Type distribution
    const organizationTypeData = await SurveySubmission.aggregate([
      ...pipeline,
      { $group: { _id: "$employmentInfo.type_of_organization", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    // 7. Work Alignment distribution
    const workAlignmentData = await SurveySubmission.aggregate([
      ...pipeline,
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

// ✅ Fetch dynamic batch years for Tracer 1 (based on submitted surveys)
router.get("/tracer1-batchyears", async (req, res) => {
  try {
    const batchYears = await SurveySubmission.aggregate([
      {
        $lookup: {
          from: "students", // 🔵 link to Student collection
          localField: "userId",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      {
        $group: {
          _id: "$studentInfo.gradyear"
        }
      },
      {
        $project: {
          _id: 0,
          gradyear: "$_id"
        }
      },
      { $sort: { gradyear: 1 } }
    ]);

    const gradyears = batchYears.map(b => b.gradyear);

    res.json({ success: true, batchYears: gradyears });
  } catch (error) {
    console.error("Error fetching tracer1 batch years:", error);
    res.status(500).json({ success: false, message: "Failed to fetch batch years." });
  }
});

// ✅ Fetch batch years for Tracer 2
router.get("/tracer2-batchyears", async (req, res) => {
  try {
    const batchYears = await TracerSurvey2.aggregate([
      { $match: { version: 2 } },
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
          _id: "$studentInfo.gradyear"
        }
      },
      {
        $project: {
          _id: 0,
          gradyear: "$_id"
        }
      },
      { $sort: { gradyear: 1 } }
    ]);

    const gradyears = batchYears.map(b => b.gradyear);

    res.json({ success: true, batchYears: gradyears });
  } catch (error) {
    console.error("Error fetching tracer2 batch years:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tracer2 batch years." });
  }
});

// ✅ Fetch colleges and courses for Tracer 2
router.get("/tracer2-colleges", async (req, res) => {
  try {
    const colleges = await TracerSurvey2.distinct("college", { version: 2 });

    const coursesData = await TracerSurvey2.aggregate([
      { $match: { version: 2 } },
      {
        $group: {
          _id: "$college",
          courses: { $addToSet: "$course" }
        }
      }
    ]);

    const courseMap = {};
    coursesData.forEach(item => {
      if (item._id) courseMap[item._id] = item.courses;
    });

    res.json({ success: true, colleges, courses: courseMap });
  } catch (error) {
    console.error("Error fetching colleges/courses for Tracer 2:", error);
    res.status(500).json({ success: false, message: "Failed to fetch colleges/courses." });
  }
});

// ✅ Fetch analytics with batch-college-course filtering
router.get("/tracer2/analytics", async (req, res) => {
  try {
    const { batch, college, course } = req.query;

    const match = { version: 2 };

    if (college) match["education.college"] = college;
    if (course) match["education.course"] = course;
    

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "students",
          localField: "userId",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: { path: "$studentInfo", preserveNullAndEmptyArrays: true } },
    ];

    if (batch) {
      pipeline.push({
        $match: { "studentInfo.gradyear": Number(batch) }
      });
    }

    const submissions = await TracerSurvey2.aggregate(pipeline);

    // Analytics computations
    const totalRespondents = submissions.length;
    const totalEmployed = submissions.filter(entry => {
      const status = (entry.job_status || "").toLowerCase().trim();
      return status && status !== "unemployed";
    }).length;

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

    const reasons = {};
    submissions.forEach(entry => {
      for (const [key, obj] of Object.entries(entry.reasons || {})) {
        if (!reasons[key]) reasons[key] = { undergraduate: 0, graduate: 0 };
        if (obj.undergraduate) reasons[key].undergraduate++;
        if (obj.graduate) reasons[key].graduate++;
      }
    });

    const job_status = {};
    submissions.forEach(entry => {
      const raw = (entry.job_status || "").trim().toLowerCase();
      const normalized = raw || "unemployed";
      const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
      job_status[label] = (job_status[label] || 0) + 1;
    });

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
      if ((entry.job_status || "").toLowerCase() !== "unemployed") {
        const count = (field, value) => {
          if (value) jobData[field][value] = (jobData[field][value] || 0) + 1;
        };

        count("lineOfBusiness", job.lineOfBusiness);
        count("placeOfWork", job.placeOfWork);
        count("firstJobDuration", job.firstJobDuration);
        count("jobLandingTime", job.jobLandingTime);
        count("position", job.position);
        count("work_alignment", job.work_alignment);

        Object.entries(job.firstJobSearch || {}).forEach(([key, val]) => {
          if (val) jobData.firstJobSearch[key] = (jobData.firstJobSearch[key] || 0) + 1;
        });

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
    const { batch, college, course } = req.query;

    const tracer1Query = { surveyType: "Tracer1" };
    const tracer2Query = { version: 2 };

    if (college) tracer1Query["employmentInfo.college"] = college;
    if (course) tracer1Query["employmentInfo.course"] = course;
    if (college) tracer2Query["education.college"] = college;
    if (course) tracer2Query["education.course"] = course;

    const tracer1Submissions = await SurveySubmission.find(tracer1Query).populate('userId');
    const tracer2Submissions = await TracerSurvey2.find(tracer2Query).populate('userId');

    const tracer1Map = new Map();
    tracer1Submissions.forEach((doc) => {
      tracer1Map.set(doc.userId._id.toString(), doc);
    });

    const usersWithBoth = tracer2Submissions.filter((doc) => tracer1Map.has(doc.userId._id.toString()));

    const filteredUsersWithBoth = batch
      ? usersWithBoth.filter((doc) => doc.userId.gradyear === Number(batch))
      : usersWithBoth;

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
      tracer2: {},
    };
    
    let jobLevelCount1 = 0;
    let jobLevelCount2 = 0;

    filteredUsersWithBoth.forEach((tracer2Doc) => {
      const userId = tracer2Doc.userId._id.toString();
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

      const level1 = tracer1Doc.employmentInfo?.job_level;
      if (level1 && level1 !== "NotApplicable") {
        job_level.tracer1[level1] = (job_level.tracer1[level1] || 0) + 1;
        jobLevelCount1++;
      }

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

    // 🔥 Build dynamic mapping
    const batchYearToColleges = {};
    const collegeToCourses = {};

    tracer2Submissions.forEach((doc) => {
      const year = doc.userId?.gradyear;
      if (!year) return;

      if (doc.education && Array.isArray(doc.education)) {
        doc.education.forEach((edu) => {
          if (edu.college) {
            if (!batchYearToColleges[year]) batchYearToColleges[year] = new Set();
            batchYearToColleges[year].add(edu.college);

            if (!collegeToCourses[edu.college]) collegeToCourses[edu.college] = new Set();
            if (edu.course) {
              collegeToCourses[edu.college].add(edu.course);
            }
          }
        });
      }
    });

    // Convert Sets to Arrays
    for (let year in batchYearToColleges) {
      batchYearToColleges[year] = Array.from(batchYearToColleges[year]);
    }
    for (let college in collegeToCourses) {
      collegeToCourses[college] = Array.from(collegeToCourses[college]);
    }

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
        tracer1: toPercentJob(job_level.tracer1, jobLevelCount1),
        tracer2: toPercentJob(job_level.tracer2, jobLevelCount2),
      },
      filters: {
        batchYearToColleges,
        collegeToCourses,
      },
    });

  } catch (err) {
    console.error("/tracer/comparison error", err);
    res.status(500).json({ error: "Failed to generate comparison." });
  }
});


  export default router;