import express from 'express';
import { connectToDatabase } from './db/connection.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const {
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
    if (!firstName || !lastName || !middleName || !birthday || !password || !confirmPassword) {
      console.log("Error: Missing fields");
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      console.log("Error: Passwords do not match");
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('students');

    // Generate unique user ID
    const randomID = Math.floor(10000 + Math.random() * 90000); // Generate random 5-digit number
    const generatedID = `${lastName.toLowerCase()}-${randomID}`;

    // Check for existing user with the same generated ID
    const existingUser = await usersCollection.findOne({ generatedID });
    if (existingUser) {
      console.log("Error: Duplicate user ID generated");
      return res.status(500).json({ error: 'Error generating unique user ID. Please try again.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into MongoDB
    const result = await usersCollection.insertOne({
      firstName,
      middleName,
      lastName,
      generatedID, // Store the unique ID
      birthday: new Date(birthday), // Ensure birthday is stored as a Date object
      password: hashedPassword,
      registrationDate: new Date(),
    });

    if (result.insertedId) {
      console.log(`User registered with ID: ${generatedID}`);
      res.status(201).json({ message: 'User registered successfully!', generatedID });
    } else {
      console.log('Error: Failed to insert user data');
      res.status(500).json({ error: 'Error registering user, insertion failed.' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Error registering user.' });
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { alumniID, password } = req.body;

  console.log('Received login data:', req.body);

  try {
    if (!alumniID || !password) {
      return res.status(400).json({ error: 'Alumni ID and password are required.' });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('students');

    // Find user by alumni ID
    const user = await usersCollection.findOne({ generatedID: alumniID });

    if (!user) {
      console.log('Error: User not found');
      return res.status(401).json({ error: 'Invalid Alumni ID or password.' });
    }

    // Compare provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Error: Invalid password');
      return res.status(401).json({ error: 'Invalid Alumni ID or password.' });
    }

    console.log(`User logged in: ${user.generatedID}`);
    res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error logging in.' });
  }
});

export default router;
