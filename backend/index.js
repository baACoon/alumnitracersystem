import express from "express";
import cors from "cors";
import path from "path";
import { connectToDatabase } from '../backend/db/connection.js';
import records from './record.js';
import surveyRoutes from './routes/surveyroutes.js'; // Import survey routes
import TracerSurvey2Routes from './routes/tracerSurvey2Routes.js'; // Import TracerSurvey2 routes
import dynamicSurveyRoutes from './routes/dynamicSurveyRoutes.js'
import adminlogreg from './models/adminlog_reg.js';
import eventRoutes from './models/event.js'
//import userProfile from './models/profile.js'
import dotenv from 'dotenv';
import articleRoutes from './routes/artcileroutes.js';
import jobRoutes from './routes/jobroutes.js';
import profileRoutes from './routes/profile.js';
import alumnipage from './routes/alumnipageroutes.js';
import pendingRoutes from './routes/pendingRoutes.js';
import dashboardRoutes from './routes/dashboardroutes.js';
import TempReportRoutes from './routes/reportsRoutes.js';
import uploadRoutes from './routes/uploadroutes.js';
// import reminderRoutes from "./routes/reminderroutes.js";
import notificationRoutes from "./routes/notificationroutes.js";
import recoverRoutes from './routes/recoverRoutes.js';
import Graduate from './models/graduateModels.js';

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
app.use("/tracerSurvey2", TracerSurvey2Routes); // Add TracerSurvey2 routes
app.use("/api/newSurveys", dynamicSurveyRoutes);
app.use("/adminlog_reg", adminlogreg);
app.use("/event", eventRoutes);
//app.use("/user", userProfile);
app.use("/artcileroutes", articleRoutes);
app.use("/jobs", jobRoutes);
app.use("/pending", pendingRoutes);
app.use("/profile", profileRoutes);
app.use("/api/alumni", alumnipage);
app.use("/dashboard", dashboardRoutes);
app.use("/tempReport", TempReportRoutes);
app.use("/api", uploadRoutes);
// app.use("/api/reminders", reminderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/recover', recoverRoutes);
// Connect to MongoDB Atlas before starting the server

app.post('/submit', async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    // Extract fields (support both combined 'name' and split fields)
    const { name, firstName, lastName, middleName, gradYear, email, college } = req.body;

    // If 'name' is provided but split fields aren't, parse it
    const resolvedFirstName = firstName || (name ? name.split(' ')[0] : null);
    const resolvedLastName = lastName || (name ? name.split(' ').pop() : null);
    const resolvedMiddleName = middleName || (name && name.split(' ').length > 2 ? name.split(' ')[1] : '');

    // Validate required fields
    if (!resolvedFirstName || !resolvedLastName || !email || !college) {
      return res.status(400).send("Missing required fields: firstName/lastName, email, or college.");
    }

    // Create document
    const newGraduate = new Graduate({
      firstName: resolvedFirstName,
      lastName: resolvedLastName,
      middleName: resolvedMiddleName,
      gradYear: gradYear || new Date().getFullYear().toString(), // Default to current year
      email,
      college,
      name: name || `${resolvedFirstName} ${resolvedLastName}` // Backward compatibility
    });

    await newGraduate.save();
    res.status(200).send("Data inserted successfully");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send(err.message); // Send actual error message
  }
});
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB Atlas. Server not started:", error);
  });