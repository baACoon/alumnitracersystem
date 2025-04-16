import express from 'express';
import mongoose from 'mongoose';
import { Student } from '../record.js'; // Import the existing Student schema
import { SurveySubmission } from "./surveyroutes.js"; // Import the existing SurveySubmission schema
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to authenticate token
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

// Get all alumni (with filters and pagination)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);

    const college = req.query.college?.trim() || null;
    const course = req.query.course?.trim() || null;
    const batch = req.query.batch ? parseInt(req.query.batch) : null; // ✅ CORRECTED

    const query = {};
    if (batch) query["personalInfo.gradyear"] = batch;
    if (college && college !== "") query["personalInfo.college"] = college;
    if (course && course !== "") query["personalInfo.course"] = course;
    console.log("Applied filter query:", query); // ✅ Debugging line

    const surveys = await SurveySubmission.aggregate([
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
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

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
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching surveys:', error.message);
    res.status(500).json({ error: 'Failed to fetch survey data.' });
  }
});

// Get details of a specific latestSurvey by userId
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format.' });
    }

    const student = await Student.findById(userId).lean();
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const surveys = await SurveySubmission.find({ userId }).sort({ createdAt: -1 }).lean();

    if (surveys.length === 0) {
      return res.status(404).json({ error: 'No surveys found for the specified user.' });
    }

    const latestSurvey = surveys[0];

    res.status(200).json({
      success: true,
      data: {
        generatedID: student.generatedID || 'N/A',
        profileImage: student.profileImage || null,
        personalInfo: {
          first_name: student.first_name || latestSurvey.personalInfo?.first_name || 'N/A',
          last_name: student.last_name || latestSurvey.personalInfo?.last_name || 'N/A',
          middle_name: student.middle_name || latestSurvey.personalInfo?.middle_name || 'N/A',
          birthdate: student.birthdate || latestSurvey.personalInfo?.birthdate || 'N/A',
          address: student.address || latestSurvey.personalInfo?.address || 'N/A',
          contact_no: student.contact_no || latestSurvey.personalInfo?.contact_no || 'N/A',
          email_address: student.email_address || latestSurvey.personalInfo?.email_address || 'N/A',
          degree: latestSurvey.personalInfo?.degree || latestSurvey.degree || 'N/A',
          college: latestSurvey.personalInfo?.college || latestSurvey.college || 'N/A',
          course: latestSurvey.personalInfo?.course || latestSurvey.course || 'N/A',
          gradyear: student.gradyear || latestSurvey.personalInfo?.gradyear || 'N/A'
        },
        employmentInfo: latestSurvey.employmentInfo || {},
        surveys: surveys.map(s => ({
          title: s.surveyType || 'Untitled Survey',
          date: s.surveyDate || s.createdAt,
          createdAt: s.createdAt,
          employmentInfo: s.employmentInfo || {},
          personalInfo: s.personalInfo || {}
        })) || []
      }
    });
  } catch (error) {
    console.error(`Error fetching latestSurvey details for userId ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch latestSurvey details.' });
  }
});



export default router;
