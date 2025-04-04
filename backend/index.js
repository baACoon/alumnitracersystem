import express from "express";
import cors from "cors";
import path from "path";
import { connectToDatabase } from '../backend/db/connection.js';
import records from './record.js';
import surveyRoutes from './routes/surveyroutes.js'; // Import survey routes
import dynamicSurveyRoutes from './routes/dynamicSurveyRoutes.js'
import adminlogreg from './models/adminlog_reg.js';
import eventRoutes from './models/event.js'
//import userProfile from './models/profile.js'
import dotenv from 'dotenv';
import articleRoutes from './routes/artcileroutes.js';
import jobRoutes from './routes/jobroutes.js';
import profileRoutes from './routes/profile.js';
import alumnipage from './routes/alumnipageroutes.js';
import dashboardRoutes from './routes/dashboardroutes.js';
import uploadRoutes from './routes/uploadroutes.js';
import fs from 'fs';

const PORT = process.env.PORT || 5050;
const app = express(); 

dotenv.config();

// Middleware
app.use(cors({ origin: ['https://tupalumni.com', 'https://admin.tupalumni.com', 'http://localhost:3000','http://localhost:5050','http://localhost:3001']}));
app.use(express.json());

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Routes
app.use("/record", records); // Existing records routes
app.use("/surveys", surveyRoutes); // Add survey routes
app.use("/api/newSurveys", dynamicSurveyRoutes);
app.use("/adminlog_reg", adminlogreg);
app.use("/event", eventRoutes);
//app.use("/user", userProfile);
app.use("/artcileroutes", articleRoutes);
app.use("/jobs", jobRoutes);
app.use("/profile", profileRoutes);
app.use("/api/alumni", alumnipage);
app.use("/dashboard", dashboardRoutes);
app.use("/api", uploadRoutes);

// Connect to MongoDB Atlas before starting the server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB Atlas. Server not started:", error);
  });