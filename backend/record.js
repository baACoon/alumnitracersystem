import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Graduate from "./models/graduateModels.js";

const router = express.Router();

// Student Schema
const studentSchema = new mongoose.Schema({
  surveys: [{type: mongoose.Schema.Types.ObjectId, ref: 'Survey'}],
  gradyear: { type: Number, required: true },
  firstName: { type: String, required: true }, // Added firstName field which was missing
  lastName: { type: String, required: true },
  generatedID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
});

const Student = mongoose.model("Student", studentSchema);

// Register a new user
router.post("/register", async (req, res) => {
  const {
    gradyear,
    firstName,
    lastName,
    password,
    confirmPassword,
  } = req.body;

  console.log("Received registration data:", { gradyear, firstName, lastName });

  try {
    // Validate input fields
    if (!gradyear || !firstName || !lastName || !password || !confirmPassword) {
      console.log("Error: Missing fields");
      return res.status(400).json({ error: "All fields are required." });
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      console.log("Error: Passwords do not match");
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Ensure graduation year is a number
    const parsedGradYear = parseInt(gradyear);
    if (isNaN(parsedGradYear)) {
      console.log("Error: Invalid graduation year");
      return res.status(400).json({ error: "Invalid graduation year." });
    }

    // Trim and normalize names
    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();

    // Exact match verification with case-insensitive comparison
    const graduate = await Graduate.findOne({
      firstName: { $regex: new RegExp(`^${normalizedFirstName}$`, "i") },
      lastName: { $regex: new RegExp(`^${normalizedLastName}$`, "i") },
      gradYear: parsedGradYear,
    });    
    
    console.log("Graduate verification:", {
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      gradYear: parsedGradYear,
      foundGraduate: !!graduate, // Will be true if graduate is found
    });

    // If no matching graduate is found, prevent registration
    if (!graduate) {
      return res.status(401).json({
        error: "Verification failed. You are not in our graduate records."
      });
    }

    // Check if user already exists (additional check)
    // In your backend's /register route
    // Sample backend logic
    const existingStudent = await Student.findOne({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gradyear: req.body.gradyear,
    });

    if (existingStudent) {
      return res.status(409).json({
          error: "An account already exists with this name and graduation year."
      });
    }

    

    // Generate unique user ID
    const randomID = Math.floor(10000 + Math.random() * 90000); // Generate random 5-digit number
    const generatedID = `${normalizedLastName.toLowerCase()}-${randomID}`;

    // Check for existing user with the same generated ID
    const existingUserWithID = await Student.findOne({ generatedID });
    if (existingUserWithID) {
      console.log("Error: Duplicate user ID generated");
      return res.status(500).json({ error: "Error generating unique user ID. Please try again." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new Student({
      gradyear: parsedGradYear,
      firstName: normalizedFirstName,  // Store first name too
      lastName: normalizedLastName,
      generatedID,
      password: hashedPassword,
      registrationDate: new Date(),
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser._id,
        generatedID: newUser.generatedID,
        lastName: newUser.lastName 
      },
      process.env.JWT_SECRET, // Ensure this is set in your .env file
      { expiresIn: '24h' }
    );

    console.log(`User registered with ID: ${generatedID}`);
    console.log("Register response:", { 
      message: "User registered successfully!",
      token: token,
      user: {
        id: newUser._id.toString(),
        generatedID,
        lastName: newUser.lastName,
      }
    });

    res.status(201).json({ 
      message: "User registered successfully!",
      token: token,
      user: {
        id: newUser._id.toString(),
        generatedID,
        lastName: newUser.lastName
      }
    });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ 
      error: "Error registering user.", 
      details: error.message 
    });
  }
});

router.post("/check-account", async (req, res) => {
  const { firstName, lastName, gradyear } = req.body;

  try {
      // First check if they're a graduate
      const graduate = await Graduate.findOne({
          firstName: { $regex: new RegExp(`^${firstName.trim()}$`, "i") },
          lastName: { $regex: new RegExp(`^${lastName.trim()}$`, "i") },
          gradYear: parseInt(gradyear)
      });

      if (!graduate) {
        return res.status(404).json({ error: "Graduate not found" });
      }

       // Then check if they're registered as a student
    const student = await Student.findOne({
      firstName: { $regex: new RegExp(`^${firstName.trim()}$`, "i") },
      lastName: { $regex: new RegExp(`^${lastName.trim()}$`, "i") },
      gradyear: parseInt(gradyear)
    });

    res.json({
      exists: !!student,
      user: student ? {
        generatedID: student.generatedID,
        registrationDate: student.registrationDate
      } : null,
      graduate: {
        firstName: graduate.firstName,
        lastName: graduate.lastName,
        gradYear: graduate.gradYear
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/verify-graduate", async (req, res) => {
  const { firstName, lastName, gradYear } = req.query;
  
  try {
      console.log("Verifying graduate:", { firstName, lastName, gradYear });
      
      if (!firstName || !lastName || !gradYear) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      const graduate = await Graduate.findOne({
          firstName: { $regex: new RegExp(`^${firstName.trim()}$`, 'i') },
          lastName: { $regex: new RegExp(`^${lastName.trim()}$`, 'i') },
          gradYear: parseInt(gradYear)
      });

      console.log("Graduate verification result:", !!graduate);

      res.json({ 
          found: !!graduate,
          graduate: graduate ? { 
              firstName: graduate.firstName, 
              lastName: graduate.lastName, 
              gradYear: graduate.gradYear 
          } : null
      });
  } catch (error) {
      console.error("Error verifying graduate:", error);
      res.status(500).json({ error: error.message });
  }
});

//forgot password 
// Password Reset Request (Step 1)
router.post("/forgot-password", async (req, res) => {
  const { alumniID } = req.body;

  console.log("Received forgot password request for:", alumniID);

  try {
    if (!alumniID) {
      return res.status(400).json({ error: "Alumni ID is required." });
    }

    // Find user by Alumni ID
    const user = await Student.findOne({ generatedID: alumniID });

    if (!user) {
      console.log("Error: User not found with ID:", alumniID);
      return res.status(404).json({ error: "Alumni ID not found." });
    }

    // Generate a reset token (valid for 15 minutes)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    console.log(`Password reset token for ${alumniID}: ${resetToken}`);

    res.status(200).json({ message: "Proceed to reset your password.", resetToken });
  } catch (error) {
    console.error("Error during password reset request:", error);
    res.status(500).json({ error: "Error processing password reset request." });
  }
});

// Reset Password (Step 2)
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  console.log("Received reset password request:", { token, newPassword });

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required." });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log("Invalid or expired token");
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    // Find user by decoded token
    const user = await Student.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    console.log(`Password updated successfully for: ${user.generatedID}`);
    res.status(200).json({ message: "Password reset successfully. You can now log in with your new password." });

  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Error resetting password." });
  }
});

// Login an existing user
router.post("/login", async (req, res) => {
  const { alumniID, password } = req.body;

  console.log("Received login data:", req.body);

  try {
    if (!alumniID || !password) {
      console.log("Validation error: Missing alumniID or password");
      return res.status(400).json({ error: "Alumni ID and password are required." });
    }

    // Find user by alumni ID
    const user = await Student.findOne({ generatedID: alumniID });

    if (!user) {
      console.log(`Error: User not found with ID: ${alumniID}`);
      return res.status(401).json({ error: "Invalid Alumni ID or password." });
    }

    // Compare provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("Password validation:", {
      providedPassword: password,
      storedHashedPassword: user.password,
      isPasswordValid: isPasswordValid,
    });

    if (!isPasswordValid) {
      console.log("Error: Invalid password for user:", alumniID);
      return res.status(401).json({ error: "Invalid Alumni ID or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        generatedID: user.generatedID,
        lastName: user.lastName
      },
      process.env.JWT_SECRET, // Make sure to set this in your .env file
      { expiresIn: '24h' }
    );

    console.log(`User logged in: ${user.generatedID}`);
    console.log("Login response:", { userId: user._id, token });
    res.status(200).json({ 
      message: "Login successful!",
      token: token,
      user: {
        id: user._id,
        generatedID: user.generatedID,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error logging in." });
  }
});

export { Student };
export default router;