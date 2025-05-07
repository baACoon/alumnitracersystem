import express from 'express';
import { protect } from '../middlewares/authmiddleware.js';
import { SurveySubmission } from './surveyroutes.js';

const router = express.Router();

// Add gradmonths to employmentInfo
router.patch('/add-gradmonths/:surveyId', protect, async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { gradmonths } = req.body;

    // Add month name validation
    const monthNames = ["january", "february", "march", "april", "may", "june", 
                       "july", "august", "september", "october", "november", "december"];
    
    if (!gradmonths || !monthNames.includes(gradmonths.toLowerCase())) {
      return res.status(400).json({ 
        message: "Valid month name is required (e.g., 'january', 'february', etc.)",
        validMonths: monthNames
      });
    }

    // Store month name in lowercase for consistency
    const monthName = gradmonths.toLowerCase();

    // Find and update the survey
    const updatedSurvey = await SurveySubmission.findByIdAndUpdate(
      surveyId,
      {
        $set: {
          'employmentInfo.gradmonths': monthName,
          'updatedAt': new Date()
        }
      },
      { new: true }
    );

    if (!updatedSurvey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.status(200).json({
      success: true,
      message: "Gradmonths added successfully",
      survey: updatedSurvey
    });

  } catch (error) {
    console.error("Error adding gradmonths:", error);
    res.status(500).json({ 
      message: "Failed to add gradmonths",
      error: error.message 
    });
  }
});

// Bulk update to add gradmonths to all surveys
router.patch('/bulk-add-gradmonths', protect, async (req, res) => {
  try {
    // Enhanced debugging
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body Content:', JSON.stringify(req.body, null, 2));

    if (!req.body || !req.body.month) {
      return res.status(400).json({ 
        message: "Month is required",
        receivedBody: req.body
      });
    }

    const monthNames = ["january", "february", "march", "april", "may", "june", 
                       "july", "august", "september", "october", "november", "december"];
    
    // Validate month name
    const monthName = req.body.month.toLowerCase();
    if (!monthNames.includes(monthName)) {
      return res.status(400).json({ message: "Invalid month name" });
    }

    // Update all surveys that have employmentInfo - store the month name instead of number
    const result = await SurveySubmission.updateMany(
      { 
        'employmentInfo': { $exists: true },
        'employmentInfo.job_status': { $ne: 'Unemployed' }
      },
      {
        $set: {
          'employmentInfo.gradmonths': monthName,
          'updatedAt': new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "Gradmonths added successfully to all employed alumni",
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });

  } catch (error) {
    console.error("Error adding gradmonths:", error);
    res.status(500).json({ 
      message: "Failed to add gradmonths",
      error: error.message 
    });
  }
});

// Add this route before the export default router;
router.post('/migrate-gradmonths', protect, async (req, res) => {
  try {
    const monthNames = ["january", "february", "march", "april", "may", "june", 
                       "july", "august", "september", "october", "november", "december"];
    
    const result = await SurveySubmission.updateMany(
      { 
        'employmentInfo.gradmonths': { $type: 'number' },
        'employmentInfo.job_status': { $ne: 'Unemployed' }
      },
      [
        {
          $set: {
            'employmentInfo.gradmonths': {
              $let: {
                vars: {
                  monthIndex: { $subtract: ['$employmentInfo.gradmonths', 1] }
                },
                in: { $arrayElemAt: [monthNames, '$$monthIndex'] }
              }
            },
            'updatedAt': new Date()
          }
        }
      ]
    );

    res.status(200).json({
      success: true,
      message: "Migration completed successfully",
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });

  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).json({
      message: "Failed to migrate gradmonths",
      error: error.message
    });
  }
});

export default router;
