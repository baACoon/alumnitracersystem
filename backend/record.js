import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose"; // Also wag mo to kalimutan i addd

const router = express.Router();

//database to az. Pwede mo tong iseparate ng file pero pwede mo rin sila ipagsama nalang
//line 10-21 ayan yung nagdagdag and mapapansin mo sa router.post they call Student. Nabago rin yung structure. 
//check mo yung convo namin ni gpt and also pwede mo naman ipaupdate yung adminlog_reg.js mo kay jpt, tulad na ginawa ko
const studentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  lastName: { type: String, required: true },
  generatedID: { type: String, required: true, unique: true },
  birthday: { type: Date, required: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
});

const Student = mongoose.model("Student", studentSchema);

// Register a new user
router.post("/register", async (req, res) => {
  const {
    email,
    firstName,
    middleName,
    lastName,
    birthday,
    password,
    confirmPassword,
  } = req.body;

  console.log("Received registration data:", req.body);

  try {
    // Validate input fields
    if (!email || !firstName || !lastName || !middleName || !birthday || !password || !confirmPassword) {
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

    // Create a new user instance
    const newUser = new Student({
      email,
      firstName,
      middleName,
      lastName,
      generatedID,
      birthday: new Date(birthday),
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    console.log(`User registered with ID: ${generatedID}`);
    res.status(201).json({ message: "User registered successfully!", generatedID });
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

    console.log(`User logged in: ${user.generatedID}`);
    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error logging in." });
  }
});

export default router;
