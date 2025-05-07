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

router.post('/sendUnemployedAlumniReminders', async (req, res) => {
  try {
    const { SurveySubmission } = await import('../routes/surveyroutes.js');

    // Debug: Get full documents to see structure
    const allDocs = await SurveySubmission.find({}).lean();
    
    console.log('📄 Sample document structure:', JSON.stringify(allDocs[0], null, 2));
    console.log('🔍 Available fields:', Object.keys(allDocs[0] || {}));
    
    // Try different possible field names
    const unemployedAlumni = await SurveySubmission.find({
      $or: [
        { job_status: "Unemployed" },
        { "employmentInfo.job_status": "Unemployed" },
        { "employmentInfo.status": "Unemployed" },
        { employment_status: "Unemployed" }
      ],
      'personalInfo.email_address': { $exists: true, $ne: null }
    }).lean();

    if (!unemployedAlumni.length) {
      return res.status(200).json({ 
        message: 'No unemployed alumni to notify.',
        debug: {
          totalDocs: allDocs.length,
          sampleDoc: allDocs[0],
          availableFields: Object.keys(allDocs[0] || {}),
          query: {
            possibleFields: [
              'job_status',
              'employmentInfo.job_status',
              'employmentInfo.status',
              'employment_status'
            ]
          }
        }
      });
    }

    let emailsSent = 0;
    const emailErrors = [];

    // Send reminders to each unemployed alumni
    for (const alum of unemployedAlumni) {
      const email = alum.personalInfo?.email_address;
      const name = alum.personalInfo?.firstName || "Alumni";

      const subject = 'Monthly Employment Status Update';
      const message = `Dear ${name},

We hope this email finds you well. This is our monthly follow-up regarding your employment status.

🔔 Action Required:
If you have found employment, please update your profile:
1. Log into TUPATS at https://tupalumni.com
2. Go to your Profile
3. Update your Job Status

Need help with your job search? We're here to support you!
Our Career Services Office provides:
✓ Job Search Strategies
✓ Interview Preparation
✓ Career Counseling
✓ Job Placement Assistance

📞 Contact Career Services:
Email: careers@tup.edu.ph
Phone: (123) 456-7890

We're committed to supporting your career journey!

Best regards,
TUPATS Team`;

      try {
        await sendSingleEmailNotification(subject, message, email);
        emailsSent++;

        // Update last reminder sent date
        await SurveySubmission.findByIdAndUpdate(alum._id, {
          last_reminder_sent: new Date()
        });

      } catch (emailError) {
        console.error(` Failed to send email to ${email}:`, emailError.message);
        emailErrors.push({ email, error: emailError.message });
      }
    }

    const response = {
      message: 'Employment status check completed',
      summary: {
        totalUnemployed: unemployedAlumni.length,
        emailsSent,
        emailsFailed: emailErrors.length
      }
    };

    if (emailErrors.length > 0) {
      response.errors = emailErrors;
    }

    console.log(` Summary: Sent ${emailsSent}/${unemployedAlumni.length} emails`);
    return res.status(200).json(response);

  } catch (error) {
    console.error(' Error in unemployment check process:', error);
    return res.status(500).json({
      error: 'Failed to process unemployment check',
      details: error.message
    });
  }
});

export default router;