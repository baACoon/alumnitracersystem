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
    await client.connect();
    const db = client.db('alumni');
    const collection = db.collection('graduates');

    const result = await collection.insertOne(req.body);
    res.status(200).send('Data inserted: ' + result.insertedId);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
  } finally {
    await client.close();
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