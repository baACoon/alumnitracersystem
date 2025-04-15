import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = express.Router();

const adminSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);

// POST route for admin registration
router.post("/adminregister", async (req, res) => {
    const { username, password, confirmPassword } = req.body;
  
    //console.log("Request body received:", req.body);
  
    if (!username || !password || !confirmPassword) {
      console.error("Validation failed: Missing fields");
      return res.status(400).json({ error: "All fields are required." });
    }
  
    if (password !== confirmPassword) {
      console.error("Validation failed: Passwords do not match");
      return res.status(400).json({ error: "Passwords do not match." });
    }
  
    try {

      // Check if username already exists
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        console.error("Username already exists:", username);
        return res.status(400).json({ error: "Username already exists." });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");
  
      // Insert new admin into the database
      const result = await Admin({
        username,
        password: hashedPassword,
        createdAt: new Date(),
      });

      await result.save(); 
      console.log("Admin inserted successfully:", result);

     // Generate a JWT token
      const token = jwt.sign(
        {
          id: result._id, // Use the admin's ID
          username: result.username, // Use the admin's username
        },
        process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your .env file
        { expiresIn: "24h" }
      );
  
      res.status(201).json({ message: "Admin registered successfully.",token: token, id: result.insertedId });
    } catch (error) {
      console.error("Error during admin registration:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  // POST route for admin login
router.post("/adminlogin", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Both username and password are required." });
  }

  try {

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign(
      {
         id: admin._id, username: admin.username
        },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your .env file
      { expiresIn: "24h" }
    );

    // Login successful
    res.status(200).json({ message: "Login successful.", token, redirect: "/alumni-page"  });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });

    const resetToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.status(200).json({ resetToken });
  } catch (err) {
    res.status(500).json({ error: 'Error processing password reset.' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();
    res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
});



export default router;
