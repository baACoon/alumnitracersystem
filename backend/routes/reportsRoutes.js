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

router.get("/chart-summary/:surveyType", async (req, res) => {
  const { surveyType } = req.params;
  const { batch, surveyId } = req.query;

  try {
    if (surveyType === "Tracer1") {
      let query = { surveyType: "Tracer1" };
      if (batch) {
        const students = await Student.find({ gradyear: batch }).select("_id");
        const ids = students.map(stud => stud._id);
        query.userId = { $in: ids };
      }
      if (surveyId) {
        query._id = surveyId;
      }

      const tracer1 = await SurveySubmission.find(query).populate("userId");

      const degreeTypes = {};
      const collegeData = {};
      const employmentStatus = { Employed: 0, Unemployed: 0 };
      const typeOfOrganization = {};
      const workAlignment = {};
      const yearStarted = {};

      tracer1.forEach((entry) => {
        const employment = entry.employmentInfo?.job_status;
        if (employment) employmentStatus[employment] = (employmentStatus[employment] || 0) + 1;

        (entry.educInfo?.degreeType || []).forEach((deg) => {
          degreeTypes[deg] = (degreeTypes[deg] || 0) + 1;
        });

        const college = entry.educInfo?.college;
        if (college) collegeData[college] = (collegeData[college] || 0) + 1;      

        const org = entry.employmentInfo?.type_of_organization;
        if (org) typeOfOrganization[org] = (typeOfOrganization[org] || 0) + 1;

        const alignment = entry.employmentInfo?.work_alignment;
        if (alignment) workAlignment[alignment] = (workAlignment[alignment] || 0) + 1;

        const year = entry.employmentInfo?.year_started;
        if (year) yearStarted[year] = (yearStarted[year] || 0) + 1;
      });

      return res.json({
        success: true,
        data: {
          respondentCount: tracer1.length,
          degreeData: Object.entries(degreeTypes).map(([name, value]) => ({ name, value })),
          collegeData: Object.entries(collegeData).map(([name, value]) => ({ name, value })), // ADD THIS LINE!
          employmentStatusData: Object.entries(employmentStatus).map(([name, value]) => ({ name, value })),
          organizationTypeData: Object.entries(typeOfOrganization).map(([name, value]) => ({ name, value })),
          workAlignmentData: Object.entries(workAlignment).map(([name, value]) => ({ name, value })),
          yearStartedData: Object.entries(yearStarted).map(([name, value]) => ({ name, value }))
        }
      });
      

    } else if (surveyType === "Tracer2") {
      let query = {};
      if (batch) {
        const students = await Student.find({ gradyear: batch }).select("_id");
        const ids = students.map(stud => stud._id);
        query.userId = { $in: ids };
      }
      if (surveyId) {
        query._id = surveyId;
      }
    
      const tracer2 = await TracerSurvey2.find(query).populate("userId");
    
      // Employment status
      const employmentStatus = { Employed: 0, Unemployed: 0, "Self-employed": 0, "Part-time": 0, "Further Studies": 0 };
      
      // Advanced degrees
      const advancedDegreeHolders = { doctorate: 0, masters: 0 };
      
      // Job data
      const jobData = {
        position: {},
        coreCompetencies: {},
        lineOfBusiness: {},
        placeOfWork: {},
        firstJobSearch: {},
        firstJobDuration: {},
        jobLandingTime: {},
        work_alignment: {}
      };
      
      // Reasons for advanced studies
      const reasons = {
        "Career Advancement": { undergraduate: 0, graduate: 0 },
        "Personal Interest": { undergraduate: 0, graduate: 0 },
        "Required by Employer": { undergraduate: 0, graduate: 0 },
        "Family Influence": { undergraduate: 0, graduate: 0 }
      };
    
      tracer2.forEach((entry) => {
        // Employment status
        const employment = entry.job_status;
        if (employment) employmentStatus[employment] = (employmentStatus[employment] || 0) + 1;
    
        // Advanced degrees
        (entry.education || []).forEach((edu) => {
          if (edu.degreeType?.includes("Doctorate")) advancedDegreeHolders.doctorate++;
          if (edu.degreeType?.includes("Masters")) advancedDegreeHolders.masters++;
        });
    
        // Job position
        const position = entry.jobDetails?.position;
        if (position) {
          jobData.position[position] = (jobData.position[position] || 0) + 1;
        }
    
        // Core competencies
        if (entry.jobDetails?.competencies) {
          Object.entries(entry.jobDetails.competencies).forEach(([skill, value]) => {
            if (value) {
              jobData.coreCompetencies[skill] = (jobData.coreCompetencies[skill] || 0) + 1;
            }
          });
        }
    
        // Line of business
        const business = entry.jobDetails?.lineOfBusiness;
        if (business) {
          jobData.lineOfBusiness[business] = (jobData.lineOfBusiness[business] || 0) + 1;
        }
    
        // Place of work
        const place = entry.jobDetails?.placeOfWork;
        if (place) {
          jobData.placeOfWork[place] = (jobData.placeOfWork[place] || 0) + 1;
        }
    
        // First job search method
        if (entry.jobDetails?.firstJobSearch) {
          Object.entries(entry.jobDetails.firstJobSearch).forEach(([method, value]) => {
            if (value) {
              jobData.firstJobSearch[method] = (jobData.firstJobSearch[method] || 0) + 1;
            }
          });
        }
    
        // First job duration
        const duration = entry.jobDetails?.firstJobDuration;
        if (duration) {
          jobData.firstJobDuration[duration] = (jobData.firstJobDuration[duration] || 0) + 1;
        }
    
        // Job landing time
        const landingTime = entry.jobDetails?.jobLandingTime;
        if (landingTime) {
          jobData.jobLandingTime[landingTime] = (jobData.jobLandingTime[landingTime] || 0) + 1;
        }
    
        // Work alignment
        const alignment = entry.jobDetails?.work_alignment;
        if (alignment) {
          jobData.work_alignment[alignment] = (jobData.work_alignment[alignment] || 0) + 1;
        }
    
        // Reasons for advanced studies
        if (entry.motivation) {
          const isAdvancedDegreeHolder = entry.education?.some(edu => 
            edu.degreeType?.includes("Masters") || edu.degreeType?.includes("Doctorate")
          );
          
          Object.entries(entry.motivation).forEach(([reason, value]) => {
            if (value && reasons[reason]) {
              if (isAdvancedDegreeHolder) {
                reasons[reason].graduate++;
              } else {
                reasons[reason].undergraduate++;
              }
            }
          });
        }
      });
    
      // Calculate total employed (excluding unemployed and further studies)
      const totalEmployed = employmentStatus.Employed + employmentStatus["Self-employed"] + employmentStatus["Part-time"];
    
      return res.json({
        success: true,
        data: {
          respondentCount: tracer2.length,
          totalEmployed,
          advancedDegreeHolders,
          job_status: employmentStatus,
          jobData,
          reasons,
          // Keep existing data for compatibility
          degreeData: Object.entries(advancedDegreeHolders).map(([name, value]) => ({ name, value })),
          employmentStatusData: Object.entries(employmentStatus).map(([name, value]) => ({ name, value })),
          workAlignmentData: Object.entries(jobData.work_alignment).map(([name, value]) => ({ name, value })),
          // Add college data if needed
          collegeData: [] // You may need to populate this based on your data
        }
      });
    } else {
      // Custom Surveys
      const survey = await CreatedSurvey.findOne({ title: new RegExp(`^${surveyType}$`, "i") });
      if (!survey) return res.status(404).json({ success: false, message: "Survey not found" });

      const questions = await Question.find({ surveyId: survey._id });
      const responses = await Response.find({ surveyId: survey._id });

      const pieData = {};

      questions.forEach((q, qIdx) => {
        const optionsCount = {};

        responses.forEach(res => {
          const ans = res.answers[qIdx];
          if (ans?.response) {
            optionsCount[ans.response] = (optionsCount[ans.response] || 0) + 1;
          }
        });

        pieData[q.questionText] = optionsCount;
      });

      return res.json({
        success: true,
        data: {
          pieData,
          respondentCount: responses.length
        }
      });
    }
  } catch (error) {
    console.error("Chart summary error:", error);
    res.status(500).json({ success: false, message: "Failed to generate chart summary.", error: error.message });
  }
});


  
export default router;