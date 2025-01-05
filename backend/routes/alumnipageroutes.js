import express from 'express';
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
    const { page = 1, limit = 10, college, course, batch } = req.query;

    // Construct query filters
    const query = {};
    if (college) query.college = college;
    if (course) query.course = course;
    if (batch) query.batch = parseInt(batch);

    // Aggregate pipeline for fetching alumni with survey data
    const alumni = await Student.aggregate([
      { $match: query },
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
          latestSurvey: { $arrayElemAt: ['$surveys', 0] },
        },
      },
      { $sort: { registrationDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);

    // Count total documents matching the query
    const total = await Student.countDocuments(query);

    // Map the alumni data
    const mappedAlumni = alumni.map(student => ({
      userId: student._id.toString(), // Use the `_id` as the userId
      generatedID: student.generatedID || '',
      personalInfo: {
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        college: student.college || '',
        course: student.course || '',
        birthday: student.birthday || '',
      },
      latestSurvey: student.latestSurvey || null, // Include the latest survey data
    }));

    // Respond with the mapped alumni data
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

/// Get details of a specific alumni
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {

    const userId = req.user.id;
    // Fetch user's latest survey submission
    const latestSurvey = await SurveySubmission.findOne(
      { userId: alumni._id },
      {},
      { sort: { 'createdAt': -1 } }
    );

    if (!latestSurvey) {
      return res.status(404).json({ 
        success: false, 
        message: 'No survey data found' 
      });
    }

    const alumni = await Student.findById(userId);
    if (!alumni) return res.status(404).json({ error: 'alumni not found.' });
    // Get all surveys for the completed surveys section
    const allSurveys = await SurveySubmission.find({ userId: userIdd })
    .sort({ createdAt: -1 });

        res.status(200).json({
          success: true,
          data: {
            personalInfo: { ...latestSurvey.personalInfo,birthday: alumni.birthday}, // Add birthday from the Student collection,
        employmentInfo: latestSurvey.employmentInfo,
        surveys: allSurveys
          }
        });
        } catch (error) {
          console.error('Error updating alumni:', error);
          res.status(500).json({ error: 'Failed to update alumni.' });
        }
      });
{/*// Update an alumni (optional endpoint if needed)
router.get('/update/:id', authenticateToken, async (req, res) => {
  try {
    const alumni = await Student.findById(req.params.id);
    if (!alumni) return res.status(404).json({ error: 'alumni not found.' });

    // Fetch user's latest survey submission
    const latestSurvey = await SurveySubmission.findOne(
      { userId: alumni._id },
      {},
      { sort: { 'createdAt': -1 } }
    );

    if (!latestSurvey) {
      return res.status(404).json({ 
        success: false, 
        message: 'No survey data found' 
      });
    }

    // Get all surveys for the completed surveys section
    const allSurveys = await SurveySubmission.find({ userId: alumni._id })
    .sort({ createdAt: -1 });

        res.status(200).json({
          success: true,
          data: {
            personalInfo: { 
              ...alumni.personalInfo,
              ...latestSurvey?.personalInfo
            },
            employmentInfo: latestSurvey?.employmentInfo || [],
            surveys: allSurveys || []
          }
        });
        } catch (error) {
          console.error('Error updating alumni:', error);
          res.status(500).json({ error: 'Failed to update alumni.' });
        }
      });
 // Get statistics for alumni
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const stats = await SurveySubmission.aggregate([
      {
        $group: {
          _id: '$personalInfo.college',
          total: { $sum: 1 },
          jobStatus: { $addToSet: '$employmentInfo.job_status' },
        },
      },
    ]);

    res.status(200).json({
        success: true,
        data: alumni,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      });
      
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics.' });
  }
});*/}

export default router;
