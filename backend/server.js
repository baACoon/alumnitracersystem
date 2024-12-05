import express from "express";
import cors from "cors";
import records from './record.js';
import { connectToDatabase } from '../backend/db/connection.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

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
