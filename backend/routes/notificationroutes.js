import express from 'express';
import { sendSingleEmailNotification } from '../emailservice.js';

const router = express.Router();

router.post('/send-notification', async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await sendSingleEmailNotification(subject, message, email);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(' Failed to send email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

router.post('/send-survey-email', async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Missing survey title' });
  }

  const subject = `TUPATS Team: New Survey Published: ${title}`;
  const message = `Hello {{name}},\n\nA new survey titled "${title}" is now available for you to answer. Click the link below to participate:\n\nhttps://tupalumni.com/surveys\n\nThank you for your response!`;

  try {
    const { SurveySubmission } = await import('../routes/surveyroutes.js');
    const alumni = await SurveySubmission.find(
      { "personalInfo.email_address": { $exists: true, $ne: null } },
      "personalInfo.email_address"
    );

    if (!alumni.length) {
      console.log("⚠️ No alumni with email addresses found.");
      return res.status(200).json({ message: 'No recipients available.' });
    }

    for (const alum of alumni) {
      const email = alum.personalInfo?.email_address;
      if (email) {
        await sendSingleEmailNotification(subject, message, email);
      }
    }

    return res.status(200).json({ message: 'Survey emails sent to all alumni' });
  } catch (error) {
    console.error("❌ Error sending survey email:", error);
    return res.status(500).json({ error: 'Failed to send survey email' });
  }
});

router.post('/sendMonthlyReminders', async (req, res) => {
  try {
    // Step 1: Fetch all alumni with valid email addresses
    const { SurveySubmission } = await import('../routes/surveyroutes.js');
    const alumni = await SurveySubmission.find(
      { "personalInfo.email_address": { $exists: true, $ne: null } },
      "personalInfo.email_address personalInfo.fullname"
    );

    if (!alumni.length) {
      console.log("⚠️ No alumni with email addresses found.");
      return res.status(200).json({ message: 'No recipients available.' });
    }

    // Step 2: Iterate through alumni and check for pending surveys
    for (const alum of alumni) {
      const email = alum.personalInfo?.email_address;
      const name = alum.personalInfo?.fullname || "Alumni";

      // Fetch completed surveys for the user
      const completedSurveys = await SurveySubmission.find(
        { userId: alum._id },
        "surveyId"
      ).lean();

      const completedSurveyIds = completedSurveys.map((s) => s.surveyId.toString());

      // Fetch all active surveys
      const { CreatedSurvey } = await import('../models/surveyModels/CreatedSurvey.js');
      const pendingSurveys = await CreatedSurvey.find({
        status: "active",
        _id: { $nin: completedSurveyIds }, // Exclude completed surveys
      });

      if (pendingSurveys.length > 0) {
        const surveyTitles = pendingSurveys.map((s) => s.title).join(', ');
        const subject = 'Reminder: You have pending surveys to complete';
        const message = `Hello ${name},\n\nYou have the following pending surveys: ${surveyTitles}.\nPlease log in to your account to complete them.\n\nThank you!`;

        // Send email notification
        await sendSingleEmailNotification(subject, message, email);
      }
    }

    return res.status(200).json({ message: 'Monthly reminders sent successfully.' });
  } catch (error) {
    console.error(' Error sending monthly reminders:', error);
    return res.status(500).json({ error: 'Failed to send monthly reminders.' });
  }
});

export default router;