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
    const batch = parseInt(req.query.batch) || null;

    // Construct query filters
    const query = {};
    if (college) query.college = college;
    if (course) query.course = course;
    if (batch) query.batch = batch;

    // Aggregate pipeline for fetching alumni and their latest survey
    const alumni = await Student.aggregate([
      { $match: query }, // Match the query filters
      {
        $lookup: {
          from: 'surveys',
          localField: '_id',
          foreignField: 'userId',
          as: 'surveys',
        },
      },
      {
        $addFields: {
          latestSurvey: { $arrayElemAt: ['$surveys', 0] }, // Get the first survey
        },
      },
      { $sort: { registrationDate: -1 } }, // Sort by registrationDate in descending order
      { $skip: (page - 1) * limit }, // Pagination: Skip documents
      { $limit: limit }, // Pagination: Limit the number of documents
    ]);

    const total = await Student.countDocuments(query);

    const mappedAlumni = alumni.map((student) => ({
      userId: student._id.toString(),
      generatedID: student.generatedID || '',
      personalInfo: {
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        college: student.college || '',
        course: student.course || '',
        birthday: student.birthday || '',
      },
      latestSurvey: student.latestSurvey || null,
    }));

    res.status(200).json({
      success: true,
      data: mappedAlumni,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching alumni:', error.message);
    res.status(500).json({ error: 'Failed to fetch alumni data.' });
  }
});


// Get details of a specific alumnus by userId
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params; // Correct destructuring

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    // Fetch the alumnus from the Student collection
    const alumnus = await Student.findById(userId);

    if (!alumnus) {
      return res.status(404).json({ error: 'Alumnus not found.' });
    }

    // Fetch surveys associated with the alumnus
    const surveys = await SurveySubmission.find({ userId: alumnus._id }).sort({ createdAt: -1 });

     // Get the latest survey to fetch college and course
     const latestSurvey = surveys.length > 0 ? surveys[0] : null;

      // Structure the response with fallback values
      res.status(200).json({
        success: true,
        data: {
          personalInfo: {
            firstName: alumnus.firstName || 'N/A',
            lastName: alumnus.lastName || 'N/A',
            email: alumnus.email || 'N/A',
            birthday: alumnus.birthday || 'N/A',
          },
          employmentInfo: surveys.map(survey => survey.employmentInfo) || [], // Fetch employment info from surveys
          surveys: surveys || [],
        },
      });
  } catch (error) {
    console.error(`Error fetching alumnus details for userId ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch alumnus details.' });
  }
});




export default router;
