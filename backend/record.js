import express from "express";
import { connectToDatabase } from "./db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET_KEY = "e3535d6e36e58268d6f2c29632d375c51d97992a3aeb1055bdda3b04ae57c03274b20c303c50555054677e435214f71ddd8796f56c779ae0f3aca801e081a2f8"; // Replace with a secure secret key

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Log the received data for debugging
  console.log('Received registration data:', req.body);

  try {
    // Validate input
    if (!name || !email || !password) {
      console.log("Error: Missing fields");
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if the email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log("Email already exists:", email);
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    console.log('User registered successfully:', result);
    res.status(201).json({ message: 'User registered successfully!', id: result.insertedId });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Error registering user.' });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
