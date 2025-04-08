import express from 'express';
import mongoose from 'mongoose';
import { Student } from '../record.js'; // Import the existing Student schema
import { SurveySubmission } from './surveyroutes.js'; // Import the existing SurveySubmission schema
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
    // Validate and sanitize query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1); // Default page is 1
    const limit = Math.max(1, parseInt(req.query.limit) || 10); // Default limit is 10
    const college = req.query.college?.trim() || null;
    const course = req.query.course?.trim() || null;

    // Construct query filters
    const query = {};
    if (college) query['personalInfo.college'] = college;
    if (course) query['personalInfo.course'] = course;

    

    const surveys = await SurveySubmission.aggregate([
      { $match: query }, // Apply the filters
      {
        $lookup: {
          from: 'students', // Collection name for `Student`
          localField: 'userId',
          foreignField: '_id',
          as: 'studentInfo', // Resulting array of matched students
        },
      },
      { $unwind: '$studentInfo' }, // Flatten the joined `studentInfo` array
      { $sort: { createdAt: -1 } }, // Sort by the most recent survey
      { $skip: (page - 1) * limit }, // Pagination: Skip documents
      { $limit: limit }, // Pagination: Limit the number of documents
    ]);

    const total = await SurveySubmission.countDocuments(query); // Total matching documents

    // Map surveys to include only relevant fields for the TABLE
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

    // Respond with data and pagination info
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
          title: s.surveyTitle || 'Untitled Survey',
          date: s.surveyDate || s.createdAt,
          createdAt: s.createdAt
        })) || []
      }
    });
  } catch (error) {
    console.error(`Error fetching latestSurvey details for userId ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch latestSurvey details.' });
  }
});



export default router;
