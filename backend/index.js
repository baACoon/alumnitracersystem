import express from "express";
import cors from "cors";
import path from "path";
import { connectToDatabase } from '../backend/db/connection.js';
import records from './record.js';
import surveyRoutes from './routes/surveyroutes.js'; // Import survey routes
import adminlogreg from './models/adminlog_reg.js';
import eventRoutes from './models/event.js'
import articleRoutes from './routes/artcileroutes.js'
import userProfile from './models/profile.js'
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));


// Routes
app.use("/record", records); // Existing records routes
app.use("/surveys", surveyRoutes); // Add survey routes
app.use("/adminlog_reg", adminlogreg);
app.use("/event", eventRoutes);
app.use("/artcileroutes", articleRoutes)

app.use("/user", userProfile);
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