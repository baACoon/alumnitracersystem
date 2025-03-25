
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const uri = process.env.MONGODB_URI;

//const uri = "mongodb+srv://alumni:alumnipassword@alumni.fcta3.mongodb.net/alumni?retryWrites=true&w=majority&appName=Alumni";
//mongodb+srv://alumnitracer:pj3Nrrn4k32LKdEq@cluster0.cn3yf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

export async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}


