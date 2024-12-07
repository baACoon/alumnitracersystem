import express from 'express';
import { connectToDatabase } from './db/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const router = express.Router();
const SECRET_KEY = 'e3535d6e36e58268d6f2c29632d375c51d97992a3aeb1055bdda3b04ae57c03274b20c303c50555054677e435214f71ddd8796f56c779ae0f3aca801e081a2f8'; // Replace with a secure secret key

// Register a new user
router.post('/register', async (req, res) => {
  const {
    alumniID,
    college,
    course,
    firstName,
    middleName,
    lastName,
    birthday,
    password,
    confirmPassword,
  } = req.body;

  console.log('Received registration data:', req.body);

  try {
    // Validate input fields
    if (!password || !confirmPassword || !firstName || !lastName) {
      console.log("Error: Missing fields");
      return res.status(400).json({ error: 'First name, last name, and password are required.' });
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      console.log("Error: Passwords do not match");
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // If alumniID is provided, validate alumniID uniqueness
    if (alumniID) {
      const existingUser = await usersCollection.findOne({ alumniID });
      if (existingUser) {
        console.log("Alumni ID already exists:", alumniID);
        return res.status(400).json({ error: 'Alumni ID is already registered.' });
      }
    } else {
        // If no AlumniID is provided, validate other fields
        if (!college || !course || !middleName || !birthday) {
          console.log("Error: Missing fields for non-AlumniID registration");
          return res.status(400).json({ error: 'College, course, middle name, and birthday are required when no Alumni ID is provided.' });
        }

        // If alumniID is provided, proceed without requiring these fields
        if (alumniID) {
          // Alumni ID logic
          if (existingUser) {
              console.log("Alumni ID already exists:", alumniID);
              return res.status(400).json({ error: 'Alumni ID is already registered.' });
          }
        } else {
          // If no AlumniID, validate other necessary fields
          if (!college || !course || !middleName || !birthday) {
              return res.status(400).json({ error: 'Please fill in all fields (college, course, middle name, birthday).' });
          }
        }

    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into MongoDB
    const result = await usersCollection.insertOne({
      alumniID: alumniID || null,  // If no AlumniID, set to null
      college: alumniID ? null : college,
      course: alumniID ? null : course,
      firstName,
      middleName: alumniID ? null : middleName,  // Only store if no AlumniID  
      lastName,
      birthday: alumniID ? null : birthday,  // Only store if no AlumniID
      password: hashedPassword,
      registrationDate: new Date(),
    });

    if (result.insertedId) {
      res.status(201).json({ message: 'User registered successfully!', id: result.insertedId });
    } else {
      console.log('Error: Failed to insert user data');
      res.status(500).json({ error: 'Error registering user, insertion failed.' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Error registering user.' });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { alumniID, password } = req.body;

  try {
    // Validate input
    if (!alumniID || !password) {
      return res.status(400).json({ error: "Alumni ID and password are required" });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user by AlumniID
    const user = await usersCollection.findOne({ alumniID });
    if (!user) {
      return res.status(401).json({ error: "Invalid Alumni ID or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Alumni ID or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, alumniID: user.alumniID }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
