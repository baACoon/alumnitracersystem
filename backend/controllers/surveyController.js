import CreatedSurvey from "../models/surveyModels/CreatedSurvey.js";
import Question from "../models/surveyModels/Questions.js";
import Response from "../models/surveyModels/Response.js";

// Create a new survey
export const createCreatedSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    // Create the survey document in the CreatedSurvey collection
    const newSurvey = new CreatedSurvey({ title, description });
    await newSurvey.save();

    // Create questions and link them to the new created survey
    const questionDocs = questions.map(q => ({
      surveyId: newSurvey._id,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options || []
    }));

    await Question.insertMany(questionDocs);

    res.status(201).json({ message: "Survey created successfully!", survey: newSurvey });
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ error: "Error creating survey", details: error });
  }
};

// Get all surveys
export const getSurveys = async (req, res) => {
  try {
    const surveys = await CreatedSurvey.find();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving surveys" });
  }
};

// Get a single survey by ID
export const getSurveyById = async (req, res) => {
  try {
    const survey = await CreatedSurvey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: "Survey not found" });
    }

    const questions = await Question.find({ surveyId: survey._id });
    res.status(200).json({ survey, questions });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving survey" });
  }
};

// Submit a response to a survey
export const submitResponse = async (req, res) => {
  try {
    const { answers } = req.body;
    const surveyId = req.params.id;

    const response = new Response({
      surveyId,
      answers
    });

    await response.save();
    res.status(201).json({ message: "Response submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting response" });
  }
};

// Delete a survey
export const deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete survey and associated questions
    await Question.deleteMany({ surveyId: id });
    await CreatedSurvey.findByIdAndDelete(id);

    res.status(200).json({ message: "Survey deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting survey" });
  }
};

// Publish survey
export const publishSurvey = async (req, res) => {
  try {
    const surveyId = req.params.id;  // Get the survey ID from the URL parameter

    // Find the survey by ID and update its status to "active"
    const updatedSurvey = await CreatedSurvey.findByIdAndUpdate(surveyId, {
      status: "active",
    }, { new: true });  // new: true returns the updated document

    if (!updatedSurvey) {
      return res.status(404).json({ error: "Survey not found" });
    }

    res.status(200).json(updatedSurvey);  // Return the updated survey
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error publishing survey" });
  }
};


export const updateSurvey = async (req, res) => {
  const { title, description, questions } = req.body;
  const { id } = req.params;

  try {
    // Find the survey by ID and update it
    const updatedSurvey = await CreatedSurvey.findByIdAndUpdate(
      id, 
      { title, description },
      { new: true } // Return the updated survey
    );

    if (!updatedSurvey) {
      return res.status(404).json({ error: "Survey not found" });
    }

    // Update associated questions if needed
    // Assuming questions are part of the request body and need to be handled separately
    // You can implement logic here for updating questions as per your requirements

    res.status(200).json({ message: "Survey updated successfully", survey: updatedSurvey });
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(500).json({ error: "Error updating survey" });
  }
};