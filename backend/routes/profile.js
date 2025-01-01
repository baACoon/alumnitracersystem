import express from 'express';
import { authenticateToken } from '../routes/surveyroutes.js';
import { Student } from '../record.js';
import { Survey } from '../models/survey.js'; // Add this import

const router = express.Router();

// Route to fetch user profile and surveys
router.get('/user-profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated token

    // Fetch user details
    const user = await Student.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch user's surveys
    const surveys = await Survey.find({ 'userId': userId });

    // Return combined data
    res.status(200).json({
      success: true,
      data: {
        personalInfo: {
          college: user.college,
          course: user.course,
          degree: user.degree,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          address: user.address,
          birthday: user.birthday,
          email: user.email,
          contact_no: user.contact_no
        },
        employmentInfo: {
          occupation: user.occupation,
          company_name: user.company_name,
          position: user.position,
          job_status: user.job_status,
          year_started: user.year_started,
          type_of_organization: user.type_of_organization,
          work_alignment: user.work_alignment
        },
        surveys: surveys
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
});

export default router;