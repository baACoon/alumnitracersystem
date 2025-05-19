import express from 'express';
import { protect } from '../middlewares/authmiddleware.js';
import { SurveySubmission } from './surveyroutes.js';
import Graduate from '../models/graduateModels.js'; // Import the Graduate model
import { Student } from '../record.js'; // Import the Student model from record.js

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

// Add startedMonth to employmentInfo
router.patch('/add-startedMonth/:surveyId', protect, async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { startedMonth } = req.body;

    // Add month name validation
    const monthNames = ["january", "february", "march", "april", "may", "june", 
                       "july", "august", "september", "october", "november", "december"];
    
    if (!startedMonth || !monthNames.includes(startedMonth.toLowerCase())) {
      return res.status(400).json({ 
        message: "Valid month name is required (e.g., 'january', 'february', etc.)",
        validMonths: monthNames
      });
    }

    // Store month name in lowercase for consistency
    const monthName = startedMonth.toLowerCase();

    // Find and update the survey
    const updatedSurvey = await SurveySubmission.findByIdAndUpdate(
      surveyId,
      {
        $set: {
          'employmentInfo.startedMonth': monthName,
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
      message: "StartedMonth added successfully",
      survey: updatedSurvey
    });

  } catch (error) {
    console.error("Error adding startedMonth:", error);
    res.status(500).json({ 
      message: "Failed to add startedMonth",
      error: error.message 
    });
  }
});

// Bulk update to add startedMonth to all surveys
router.patch('/bulk-add-startedMonth', protect, async (req, res) => {
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
          'employmentInfo.startedMonth': monthName,
          'updatedAt': new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "StartedMonth added successfully to all employed alumni",
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });

  } catch (error) {
    console.error("Error adding startedMonth:", error);
    res.status(500).json({ 
      message: "Failed to add startedMonth",
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

// Migration route to rename gradmonths to startedMonth
router.post('/migrate-startedMonth', protect, async (req, res) => {
  try {
    const result = await SurveySubmission.updateMany(
      { 'employmentInfo.gradmonths': { $exists: true } },
      [
        {
          $set: {
            'employmentInfo.startedMonth': '$employmentInfo.gradmonths',
            'updatedAt': new Date()
          }
        },
        {
          $unset: 'employmentInfo.gradmonths'
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
      message: "Failed to migrate startedMonth",
      error: error.message
    });
  }
});

// Bulk update to add gradMonth to all graduates
router.patch('/bulk-add-gradMonth', protect, async (req, res) => {
  try {
    const { gradMonth } = req.body;

    // Validate gradMonth
    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];

    if (!gradMonth || !monthNames.includes(gradMonth.toLowerCase())) {
      return res.status(400).json({
        message: "Valid month name is required (e.g., 'january', 'february', etc.)",
        validMonths: monthNames
      });
    }

    // Store month name in lowercase for consistency
    const monthName = gradMonth.toLowerCase();

    // Update all graduates in the collection
    const result = await Graduate.updateMany(
      {},
      {
        $set: {
          gradMonth: monthName,
          updatedAt: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "GradMonth added successfully to all graduates",
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    console.error("Error adding gradMonth:", error);
    res.status(500).json({
      message: "Failed to add gradMonth",
      error: error.message
    });
  }
});

// Bulk update to add gradMonth to all registered alumni in the students collection
router.patch('/bulk-add-gradMonth-to-students', protect, async (req, res) => {
  try {
    const { gradMonth } = req.body;

    // Validate gradMonth
    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];

    if (!gradMonth || !monthNames.includes(gradMonth.toLowerCase())) {
      return res.status(400).json({
        message: "Valid month name is required (e.g., 'january', 'february', etc.)",
        validMonths: monthNames
      });
    }

    // Store month name in lowercase for consistency
    const monthName = gradMonth.toLowerCase();

    // Fetch all graduates from the graduates collection
    const graduates = await Graduate.find({}, { firstName: 1, lastName: 1, gradYear: 1 });

    // Prepare a map of graduates for quick lookup
    const graduateMap = new Map(
      graduates.map((grad) => [
        `${grad.firstName.toLowerCase()}|${grad.lastName.toLowerCase()}|${grad.gradYear}`,
        grad
      ])
    );

    // Fetch all students from the students collection
    const students = await Student.find();

    // Filter students who exist in the graduates collection
    const updates = [];
    for (const student of students) {
      const key = `${student.firstName.toLowerCase()}|${student.lastName.toLowerCase()}|${student.gradyear}`;
      if (graduateMap.has(key)) {
        updates.push(student._id);
      }
    }

    // Perform bulk update for matched students
    const result = await Student.updateMany(
      { _id: { $in: updates } },
      {
        $set: {
          gradMonth: monthName,
          updatedAt: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "GradMonth added successfully to all registered alumni",
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    console.error("Error adding gradMonth to students:", error);
    res.status(500).json({
      message: "Failed to add gradMonth to students",
      error: error.message
    });
  }
});

export default router;