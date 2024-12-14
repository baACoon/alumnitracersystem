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
    const usersCollection = db.collection('users');

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into MongoDB
    const result = await usersCollection.insertOne({
      firstName,
      middleName,
      lastName,
      birthday: new Date(birthday), // Ensure birthday is stored as a Date object
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

export default router;
