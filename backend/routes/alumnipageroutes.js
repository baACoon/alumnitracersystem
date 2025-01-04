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
    if (err || (user.exp && Date.now() >= user.exp * 1000)) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

// Get all alumni (with filters and pagination)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, college, course, gradyear } = req.query;

    // Build the query object
    const query = {};
    if (college) query['personalInfo.college'] = college;
    if (course) query['personalInfo.course'] = course;
    if (gradyear) query['personalInfo.gradyear'] = parseInt(gradyear);

    // Fetch alumni with pagination
    const alumni = await Student.find(query)
      .populate('surveys') // Populate surveys if linked
      .sort({ registrationDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(query);

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
    console.error('Error fetching alumni:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch alumni data.' });
  }
});

// Get details of a specific alumnus
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const alumnus = await Student.findById(req.params.id)
      .populate('surveys') // Populate linked surveys
      .populate('employmentInfo') // If employment details are linked
      .exec();

    if (!alumnus) return res.status(404).json({ error: 'Alumnus not found.' });

    res.status(200).json({ success: true, data: alumnus });
  } catch (error) {
    console.error('Error fetching alumnus details:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch alumnus details.' });
  }
});

// Update an alumnus (optional endpoint if needed)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedAlumnus = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAlumnus) return res.status(404).json({ error: 'Alumnus not found.' });

    res.status(200).json({ success: true, data: updatedAlumnus });
  } catch (error) {
    console.error('Error updating alumnus:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to update alumnus.' });
  }
});

export default router;


{/* 
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

