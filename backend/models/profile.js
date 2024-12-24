import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Student from '../record.js'; // Adjust path as needed
import Survey from '../routes/surveyroutes.js';   // Adjust path as needed

const router = express.Router();

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Access Denied');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
};

router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id; // The ID of the logged-in user from the JWT token

  try {
    // Fetch the user's profile from the 'students' collection
    const userProfile = await Student.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Fetch the user's survey answers from the 'surveys' collection
    const surveyResponses = await Survey.find({ userId });
    if (surveyResponses.length === 0) {
      return res.status(404).json({ message: 'No survey responses found for this user' });
    }

    // Combine profile and survey data into a single response
    res.json({
      profile: userProfile,
      surveys: surveyResponses || [] // Return empty array if no surveys
    });
  } catch (error) {
    console.error('Error fetching profile and survey data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;