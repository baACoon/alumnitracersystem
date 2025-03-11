import express from 'express';
import { authenticateToken } from '../routes/surveyroutes.js';
import { Student } from '../record.js';
import { SurveySubmission } from '../routes/surveyroutes.js'; // Add this import

const router = express.Router();

// Route to fetch user profile and surveys
router.get('/user-profile', authenticateToken, async (req, res) => {
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

// ✅ Route to change user password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Find user in Student collection
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare old password with hashed password
    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    student.password = hashedPassword;
    await student.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Failed to change password', error: error.message });
  }
});

export default router;