import express from "express";
import { createCreatedSurvey, getSurveys, getSurveyById, submitResponse, deleteSurvey, publishSurvey, updateSurvey } from "../controllers/surveyController.js";

const router = express.Router();

// Existing routes
router.post("/create", createCreatedSurvey);
router.get("/", getSurveys);
router.get("/:id", getSurveyById);
router.delete("/:id", deleteSurvey);
router.post("/:id/response", submitResponse);

// Add the route for publishing a survey (PUT request)
router.put("/:id/publish", publishSurvey);
router.put("/:id", updateSurvey);  // Route for updating survey by ID


export default router;
