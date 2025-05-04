// ✅ Updated Backend Controller: getAlumniById
import express from 'express';
import mongoose from 'mongoose';
import { Student } from '../record.js';
import { SurveySubmission } from "./surveyroutes.js";
import TracerSurvey2 from '../models/TracerSurvey2.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

router.get('/all', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || null;
    const limit = parseInt(req.query.limit) || null;
    const college = req.query.college?.trim() || null;
    const course = req.query.course?.trim() || null;
    const batch = req.query.batch ? parseInt(req.query.batch) : null;

    const query = {};
    if (batch) query["personalInfo.gradyear"] = batch;
    if (college && college !== "") query["personalInfo.college"] = college;
    if (course && course !== "") query["personalInfo.course"] = course;

    // Remove pagination from aggregation if page/limit not specified
    let aggregationPipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'students',
          localField: 'userId',
          foreignField: '_id',
          as: 'studentInfo',
        },
      },
      { $unwind: '$studentInfo' },
      { $sort: { createdAt: -1 } },
    ];

    // Only add pagination if both page and limit are provided
    if (page && limit) {
      aggregationPipeline.push(
        { $skip: (page - 1) * limit },
        { $limit: limit }
      );
    }

    const surveys = await SurveySubmission.aggregate(aggregationPipeline);
    const total = await SurveySubmission.countDocuments(query);

    const mappedSurveys = surveys.map((survey) => ({
      userId: survey.userId.toString(),
      generatedID: survey.studentInfo.generatedID,
      personalInfo: {
        first_name: survey.personalInfo.first_name,
        last_name: survey.personalInfo.last_name,
        email_address: survey.personalInfo.email_address,
        birthdate: survey.personalInfo.birthdate || 'N/A',
        college: survey.personalInfo.college,
        course: survey.personalInfo.course,
        gradyear: survey.personalInfo.gradyear || survey.studentInfo.gradyear || 'N/A',
      },
      employmentInfo: survey.employmentInfo || {},
      gradyear: survey.studentInfo.gradyear,
      submittedAt: survey.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: mappedSurveys,
      total,
    });
  } catch (error) {
    console.error('Error fetching surveys:', error.message);
    res.status(500).json({ error: 'Failed to fetch survey data.' });
  }
});

router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const student = await Student.findById(userId).lean();
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const tracer1Surveys = await SurveySubmission.find({ userId }).sort({ createdAt: -1 }).lean();
    const tracer2Survey = await TracerSurvey2.findOne({ userId }).sort({ createdAt: -1 }).lean();

    const surveys = tracer1Surveys.map(s => ({
      title: s.surveyType || 'Tracer 1',
      date: s.createdAt,
      createdAt: s.createdAt,
      employmentInfo: s.employmentInfo || {},
      personalInfo: s.personalInfo || {}
    }));

        const latestSurvey = tracer1Surveys[0];

    if (tracer2Survey) {
      surveys.push({
        title: 'Tracer 2',
        date: tracer2Survey.createdAt,
        createdAt: tracer2Survey.createdAt,
        employmentInfo: {
          job_status: tracer2Survey.job_status,
          occupation: tracer2Survey.jobDetails?.occupation,
          company_name: tracer2Survey.jobDetails?.company_name,
          year_started: tracer2Survey.jobDetails?.year_started || 'N/A',
          position: tracer2Survey.jobDetails?.position,
          type_of_organization: tracer2Survey.jobDetails?.type_of_organization,
          work_alignment: tracer2Survey.jobDetails?.work_alignment,
          reasons_for_accepting: tracer2Survey.jobDetails?.acceptingJobReasons || {},
          reasons_for_staying: tracer2Survey.jobDetails?.stayingReasons || {},
          is_present_employment: tracer2Survey.jobDetails?.firstJob === 'Yes',
          time_to_land_job: tracer2Survey.jobDetails?.jobLandingTime || 'N/A'
        },
        personalInfo: {
          sex: tracer2Survey.sex || 'N/A',
          nationality: tracer2Survey.nationality || 'N/A',
          gradyear: latestSurvey?.personalInfo?.gradyear || student.gradyear || 'N/A'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        generatedID: student.generatedID || 'N/A',
        profileImage: student.profileImage || null,
        personalInfo: latestSurvey?.personalInfo || {},
        employmentInfo: latestSurvey?.employmentInfo || {},
        surveys
      }
    });
  } catch (error) {
    console.error(`Error fetching latestSurvey details for userId ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch latestSurvey details.' });
  }
});

export default router;