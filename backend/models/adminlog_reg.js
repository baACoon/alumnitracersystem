import express from "express";
import bcrypt from "bcrypt";
import { connectToDatabase } from "../db/connection.js";

const router = express.Router();

// POST route for admin registration
router.post("/adminregister", async (req, res) => {
    const { username, password, confirmPassword } = req.body;
  
    console.log("Request body received:", req.body);
  
    if (!username || !password || !confirmPassword) {
      console.error("Validation failed: Missing fields");
      return res.status(400).json({ error: "All fields are required." });
    }
  
    if (password !== confirmPassword) {
      console.error("Validation failed: Passwords do not match");
      return res.status(400).json({ error: "Passwords do not match." });
    }
  
    try {
      const db = await connectToDatabase();
      const adminsCollection = db.collection("admins");
  
      // Check if username already exists
      const existingAdmin = await adminsCollection.findOne({ username });
      if (existingAdmin) {
        console.error("Username already exists:", username);
        return res.status(400).json({ error: "Username already exists." });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");
  
      // Insert new admin into the database
      const result = await adminsCollection.insertOne({
        username,
        password: hashedPassword,
        createdAt: new Date(),
      });
      console.log("Admin inserted successfully:", result);
  
      res.status(201).json({ message: "Admin registered successfully.", id: result.insertedId });
    } catch (error) {
      console.error("Error during admin registration:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
export default router;
