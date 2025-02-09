import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose"; // Also wag mo to kalimutan i addd
import jwt from 'jsonwebtoken';
import { protect } from "./middlewares/authmiddleware";

const router = express.Router();

//database to az. Pwede mo tong iseparate ng file pero pwede mo rin sila ipagsama nalang
//line 10-21 ayan yung nagdagdag and mapapansin mo sa router.post they call Student. Nabago rin yung structure. 
//check mo yung convo namin ni gpt and also pwede mo naman ipaupdate yung adminlog_reg.js mo kay jpt, tulad na ginawa ko
const studentSchema = new mongoose.Schema({
  surveys: [{type: mongoose.Schema.Types.ObjectId, ref: 'Survey'}],
  gradyear: { type: Number, required: true },
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
    lastName,
    password,
    confirmPassword,
  } = req.body;

  console.log("Received registration data:", req.body);

  try {
    // Validate input fields
    if (!gradyear || !lastName || !password || !confirmPassword) {
      console.log("Error: Missing fields");
      return res.status(400).json({ error: "All fields are required." });
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      console.log("Error: Passwords do not match");
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Generate unique user ID
    const randomID = Math.floor(10000 + Math.random() * 90000); // Generate random 5-digit number
    const generatedID = `${lastName.toLowerCase()}-${randomID}`;

    // Check for existing user with the same generated ID
    const existingUser = await Student.findOne({ generatedID });
    if (existingUser) {
      console.log("Error: Duplicate user ID generated");
      return res.status(500).json({ error: "Error generating unique user ID. Please try again." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new Student({
      gradyear,
      lastName,
      generatedID, // Store the unique ID
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
    res.status(500).json({ error: "Error registering user." });
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

// GET LOGGED-IN USER ("/me")
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

export { Student };

export default router;
