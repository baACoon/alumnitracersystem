import express from 'express';
import { Student } from '../record.js'; // Import the existing Student schema
import { SurveySubmission } from './surveyroutes.js'; // Import the existing SurveySubmission schema
import { authenticateToken } from '../routes/surveyroutes.js';


const router = express.Router();

// Route to fetch user profile and surveys
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user's latest survey submission
    const latestSurvey = await SurveySubmission.findOne(
      { userId: userId },
      {},
      { sort: { 'createdAt': -1 } }
    );

    if (!latestSurvey) {
      return res.status(404).json({ 
        success: false, 
        message: 'No survey data found' 
      });
    }
    // Fetch user details from the Student collection
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'User not found in Student collection'
      });
    }

    // Get all surveys for the completed surveys section
    const allSurveys = await SurveySubmission.find({ userId: userId })
      .sort({ createdAt: -1 });

    // Combine the data, using the latest survey for personal/employment info
    res.status(200).json({
      success: true,
      data: {
        personalInfo: { ...latestSurvey.personalInfo,birthday: student.birthday}, // Add birthday from the Student collection,
        employmentInfo: latestSurvey.employmentInfo,
        surveys: allSurveys
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
});

export default router;