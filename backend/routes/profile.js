import express from 'express';
import { authenticateToken } from '../routes/surveyroutes.js'; // Middleware to verify JWT tokens
import {Student} from '../record.js'; // Model for Student (adjust path as necessary)


const router = express.Router();

// Route to fetch user profile and surveys
router.get('/user/profile/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params; // Get the user ID from the URL



    // Fetch user details
    const user = await Student.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch user's survey
    const surveys = await SurveySubmission.find({ userId });

    // Return user and survey data
    res.status(200).json({
      success: true,
      data: {
        user,
        surveys,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
});

export default router;
