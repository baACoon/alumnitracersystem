import express from "express";
import cors from "cors";
import records from './record.js';
import surveyRoutes from './routes/surveyroutes.js'; // Import survey routes
import { connectToDatabase } from '../backend/db/connection.js';

const PORT = process.env.PORT || 5050;
const app = express();


// Middleware
app.use(cors({
  origin: ['http://tupalumni.com', 'https://tupalumni.com', 'http://localhost:3000'],
  methods: ['GET', 'POST'], // Specify allowed methods
  credentials: true,       // Include cookies if needed
}));
app.use(express.json());

// Routes
app.use("/record", records); // Existing records routes
app.use("/api/surveys", surveyRoutes); // Add survey routes

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
