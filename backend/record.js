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
    middleInitial,
    lastName,
    birthday,
    password,
    confirmPassword,
  } = req.body;

  console.log('Received registration data:', req.body); // Debugging line

  try {
    // Validate required fields
    if (!firstName || !lastName || !password || !confirmPassword) {
      console.log("Error: Missing required fields");
      return res.status(400).json({ error: 'First name, last name, password, and confirm password are required.' });
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      console.log("Error: Passwords do not match");
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('user');

    // Check if alumniID already exists
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
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare the user data to be inserted
    const userData = {
      alumniID: alumniID || null,  // If AlumniID is not provided, it will be null
      college: alumniID ? null : college,
      course: alumniID ? null : course,
      firstName,
      middleName: alumniID ? null : middleName,
      middleInitial: alumniID ? middleInitial : null,
      lastName,
      birthday: alumniID ? null : birthday,
      password: hashedPassword,
      registrationDate: new Date(),
    };

    // Insert the new user into the database
    const result = await usersCollection.insertOne(userData);

    console.log('Insert result:', result);

    if (result.insertedId) {
      return res.status(201).json({ message: 'User registered successfully!', id: result.insertedId });
    } else {
      console.log('Error: Failed to insert user data');
      return res.status(500).json({ error: 'Error registering user, insertion failed.' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Error registering user.' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { alumniID, password } = req.body;

  try {
    // Validate input fields
    if (!alumniID || !password) {
      return res.status(400).json({ error: 'Alumni ID and password are required' });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find user by AlumniID
    const user = await usersCollection.findOne({ alumniID });
    if (!user) {
      return res.status(401).json({ error: 'Invalid Alumni ID or password' });
    }

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid Alumni ID or password' });
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user._id, alumniID: user.alumniID }, SECRET_KEY, {
      expiresIn: '1h',
    });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
