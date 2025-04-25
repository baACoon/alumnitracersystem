import express from "express";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import Response from "../models/surveyModels/Response.js";
import CreatedSurvey from "../models/surveyModels/CreatedSurvey.js";
import Question from "../models/surveyModels/Questions.js";
import TracerSurvey2 from "../models/TracerSurvey2.js";
import { SurveySubmission } from "../routes/surveyroutes.js";
import { Student } from "../record.js"

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
  const { batch } = req.query;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Survey Export");

  try {
    if (surveyType === "Tracer1") {
      const query = { surveyType: "Tracer1" };
        if (batch) {
          const studentsInBatch = await Student.find({ gradyear: batch }).select("_id");
          const studentIds = studentsInBatch.map(student => student._id);
          query.userId = { $in: studentIds };
        }

        const tracer1 = await SurveySubmission.find(query).populate("userId");

      worksheet.columns = [
        { header: "Batch", key: "batch" },
        { header: "ID", key: "generatedID" },
        { header: "First Name", key: "firstName" },
        { header: "Last Name", key: "lastName" },
        { header: "Email", key: "email" },
        { header: "Contact Number", key: "contactNo" },
        { header: "Date of Birth", key: "birthdate" },
        { header: "Birth Place", key: "birthplace" },
        { header: "Sex", key: "sex" },
        { header: "Nationality", key: "nationality" },
        { header: "Address", key: "address" },
        { header: "Degree", key: "degree" },
        { header: "College", key: "college" },
        { header: "Course", key: "course" },
       
        { header: "Occupation", key: "occupation" },
        { header: "Company Name", key: "company" },
        { header: "Year Started", key: "yearStarted" },
        { header: "Job Status", ket: "jobStatus" },
        { header: "Job Level", key: "jobLevel" },
        { header: "Position", key: "position" },
        { header: "Type of Organization", key: "typeOfOrganization" },
        { header: "Work Alignment", key: "workAlignment" },
      ];

      tracer1.forEach((entry) => {
        worksheet.addRow({
          batch: entry.userId?.gradyear || "N/A",
          generatedID: entry.userId?.generatedID || "N/A",
          firstName: entry.personalInfo?.first_name || "N/A",
          lastName: entry.personalInfo?.last_name || "N/A",
          email: entry.personalInfo?.email_address || "N/A",
          contact_no: entry.personalInfo?.contact_no || "N/A",
          birthdate: entry.personalInfo?.birthdate || "N/A",
          birthplace: entry.personalInfo?.birthplace || "N/A",
          sex: entry.personalInfo?.sex || "N/A",
          nationality: entry.personalInfo?.nationality || "N/A",
          address: entry.personalInfo?.address || "N/A",
          degree: entry.personalInfo?.degree || "N/A",
          college: entry.personalInfo?.college || "N/A",
          course: entry.personalInfo?.course || "N/A",

          occupation: entry.employmentInfo?.occupation || "N/A",
          company: entry.employmentInfo?.company_name || "N/A",
          yearStarted: entry.employmentInfo?.year_started || "N/A",
          jobStatus: entry.employmentInfo?.job_status || "N/A",
          jobLevel: entry.employmentInfo?.job_level || "N/A",
          position: entry.employmentInfo?.position || "N/A",
          typeOfOrganization: entry.employmentInfo?.type_of_organization || "N/A",
          workAlignment: entry.employmentInfo?.work_alignment || "N/A",
        });
      });
      
    } else if (surveyType === "Tracer2") {
      let tracer2Query = {};
        if (batch) {
          const studentsInBatch = await Student.find({ gradyear: batch }).select("_id");
          const studentIds = studentsInBatch.map(student => student._id);
          tracer2Query.userId = { $in: studentIds };
        }
      const tracer2 = await TracerSurvey2.find().populate("userId");
    
      const overviewSheet = workbook.addWorksheet("Overview");
      const eduSheet = workbook.addWorksheet("Education");
      const examSheet = workbook.addWorksheet("Examinations");
      const trainingSheet = workbook.addWorksheet("Trainings");
      const motivationSheet = workbook.addWorksheet("Motivations");
      const jobSheet = workbook.addWorksheet("Job Details");
    
      overviewSheet.columns = [
        { header: "Batch", key: "batch" },
        { header: "ID", key: "generatedID"},
        { header: "Job Status", key: "job_status" },
        { header: "Occupation", key: "occupation" },
        { header: "Company", key: "company" },
        { header: "Position", key: "position" },
        { header: "Type of Organization", key: "type_of_organization" },
        { header: "Work Alignment", key: "work_alignment" },
        { header: "Salary Range", key: "salaryRange" },
      ];
    
      eduSheet.columns = [
        { header: "ID", key: "generatedID"},
        { header: "Degree Types", key: "degreeType" },
        { header: "Colleges", key: "college" },
        { header: "Courses", key: "course" },
        { header: "Year Graduated", key: "yearGraduated" },
        { header: "Institutions", key: "institution" },
      ];
    
      examSheet.columns = [
        { header: "ID", key: "generatedID"},
        { header: "Exam Names", key: "examNames" },
        { header: "Exam Dates", key: "examDates" },
        { header: "Exam Ratings", key: "examRatings" },
      ];
    
      trainingSheet.columns = [
        { header: "ID", key: "generatedID"},
        { header: "Training Titles", key: "trainingTitles" },
        { header: "Training Durations", key: "trainingDurations" },
        { header: "Training Institutions", key: "trainingInstitutions" },
      ];
    
      motivationSheet.columns = [
        { header: "ID", key: "generatedID"},
        { header: "Motivations", key: "motivations" },
        { header: "Unemployment Reasons", key: "unemploymentReasons" },
      ];
    
      jobSheet.columns = [
        { header: "ID", key: "generatedID"},
        { header: "Place of Work", key: "placeOfWork" },
        { header: "Line of Business", key: "lineOfBusiness" },
        { header: "First Job Duration", key: "firstJobDuration" },
        { header: "Job Landing Time", key: "jobLandingTime" },
        { header: "First Job Search Method", key: "firstJobSearch" },
        { header: "Staying Reasons", key: "stayingReasons" },
        { header: "Accepting Job Reasons", key: "acceptingJobReasons" },
        { header: "Changing Job Reasons", key: "changingJobReasons" },
        { header: "Competencies", key: "competencies" },
      ];
    
      tracer2.forEach((entry) => {
        const edu = entry.education?.[0] || {};
        const exams = entry.examinations || [];
        const trainings = entry.trainings || [];
    
        // Sheet: Overview
        overviewSheet.addRow({
          batch: entry.userId?.gradyear || "N/A",
          generatedID: entry.userId?.generatedID || "N/A",
          job_status: entry.job_status || "N/A",
          occupation: entry.jobDetails?.occupation || "N/A",
          company: entry.jobDetails?.company_name || "N/A",
          position: entry.jobDetails?.position || "N/A",
          type_of_organization: entry.jobDetails?.type_of_organization || "N/A",
          work_alignment: entry.jobDetails?.work_alignment || "N/A",
          salaryRange: entry.jobDetails?.salaryRange || "N/A",
        });
    
        // Sheet: Education
        eduSheet.addRow({
          generatedID: entry.userId?.generatedID || "N/A",
          degreeType: Array.isArray(edu.degreeType) ? edu.degreeType.join(", ") : edu.degreeType || "N/A",
          college: Array.isArray(edu.college) ? edu.college.join(", ") : edu.college || "N/A",
          course: Array.isArray(edu.course) ? edu.course.join(", ") : edu.course || "N/A",
          yearGraduated: edu.yearGraduated || "N/A",
          institution: Array.isArray(edu.institution) ? edu.institution.join(", ") : edu.institution || "N/A",
        });
    
        // Sheet: Examinations
        examSheet.addRow({
          generatedID: entry.userId?.generatedID || "N/A",
          examNames: exams.map(e => Array.isArray(e.examName) ? e.examName.join(", ") : e.examName || "N/A").join("; "),
          examDates: exams.map(e => e.dateTaken || "N/A").join("; "),
          examRatings: exams.map(e => e.rating || "N/A").join("; "),
        });
    
        // Sheet: Trainings
        trainingSheet.addRow({
          generatedID: entry.userId?.generatedID || "N/A",
          trainingTitles: trainings.map(t => Array.isArray(t.title) ? t.title.join(", ") : t.title || "N/A").join("; "),
          trainingDurations: trainings.map(t => t.duration || "N/A").join("; "),
          trainingInstitutions: trainings.map(t => Array.isArray(t.institution) ? t.institution.join(", ") : t.institution || "N/A").join("; "),
        });
    
        // Sheet: Motivations
        motivationSheet.addRow({
          generatedID: entry.userId?.generatedID || "N/A",
          motivations: Object.entries(entry.motivation || {}).filter(([_, v]) => v).map(([k]) => k).join(", ") || "N/A",
          unemploymentReasons: Object.entries(entry.unemploymentReasons || {}).filter(([_, v]) => v).map(([k]) => k).join(", ") || "N/A",
        });
    
        // Sheet: Job Details
        jobSheet.addRow({
          generatedID: entry.userId?.generatedID || "N/A",
          placeOfWork: entry.jobDetails?.placeOfWork || "N/A",
          lineOfBusiness: entry.jobDetails?.lineOfBusiness || "N/A",
          firstJobDuration: entry.jobDetails?.firstJobDuration || "N/A",
          jobLandingTime: entry.jobDetails?.jobLandingTime || "N/A",
          firstJobSearch: JSON.stringify(entry.jobDetails?.firstJobSearch || {}),
          stayingReasons: JSON.stringify(entry.jobDetails?.stayingReasons || {}),
          acceptingJobReasons: JSON.stringify(entry.jobDetails?.acceptingJobReasons || {}),
          changingJobReasons: JSON.stringify(entry.jobDetails?.changingJobReasons || {}),
          competencies: JSON.stringify(entry.jobDetails?.competencies || {}),
        });
      });
    
      const exportDir = path.join("exports");
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir);
      }
    
      const tempPath = path.join(exportDir, `Tracer2-${Date.now()}.xlsx`);
      await workbook.xlsx.writeFile(tempPath);
    
      res.download(tempPath, (err) => {
        if (!err) fs.unlinkSync(tempPath);
      });
    
    
    

    } else {
      // Custom Survey
      const survey = await CreatedSurvey.findOne({ title: new RegExp(`^${surveyType}$`, "i") });
      if (!survey) return res.status(404).json({ message: "Survey not found." });

      const questions = await Question.find({ surveyId: survey._id });
      const responses = await Response.find({ surveyId: survey._id }).populate("userId");

      worksheet.columns = [
        { header: "Respondent ID", key: "user" },
        ...questions.map((q, i) => ({
          header: q.questionText,
          key: `q${i}`
        }))
      ];

      responses.forEach((resData) => {
        const row = {
          user: resData.userId?.generatedID || resData.userId?._id || "N/A"
        };

        resData.answers.forEach((ans, idx) => {
          row[`q${idx}`] = ans.response || "N/A";
        });

        worksheet.addRow(row);
      });
    }

      // Build a smart file name
      let fileName = `survey-${surveyType}`;
      if (batch) {
        fileName += `-Batch${batch}`;
      }
      fileName += `-${Date.now()}.xlsx`;

      const exportDir = path.join("exports");
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir);
      }

      const tempPath = path.join(exportDir, fileName);

      await workbook.xlsx.writeFile(tempPath);

      res.download(tempPath, (err) => {
        if (!err) fs.unlinkSync(tempPath);
      });

  } catch (error) {
    console.error("❌ Export error:", error.message, error.stack);
    res.status(500).json({ message: "Failed to export.", error: error.message });
  }
});
  
export default router;