import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Graduate from '../models/graduateModels.js'; 
import { Student } from '../record.js';

dotenv.config();
const router = express.Router();

let recoveryCodes = {}; // In-memory store (use Redis or DB in production)

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send-reset-code', async (req, res) => {
  const { alumniID } = req.body;
  try {
    const student = await Student.findOne({ generatedID: alumniID });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const graduate = await Graduate.findOne({
      firstName: new RegExp(`^${student.firstName}$`, 'i'),
      lastName: new RegExp(`^${student.lastName}$`, 'i'),
      gradYear: student.gradyear
    });

    if (!graduate || !graduate.email) {
      return res.status(404).json({ message: 'Email not found for this user' });
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    recoveryCodes[graduate.email] = { code, expires: Date.now() + 15 * 60 * 1000 };

    await transporter.sendMail({
      from: `"Alumni Security Bot" <${process.env.EMAIL_USER}>`,
      to: graduate.email,
      subject: '[Secure Code] Password Reset Request',
      text: `
      Hey ${graduate.firstName || 'Alumni'},

      Your temporary reset code is:

       CODE: ${code}

      This code is valid for 15 minutes.

      If you didn’t request a password reset, no worries—just ignore this message. 
      But if you did, enter the code to complete the process and regain access.

      Stay safe,  
      – DevOps Security // Alumni Tracer System
            `.trim()
          });

    return res.json({ email: graduate.email, message: 'Reset code sent successfully' });
  } catch (err) {
    console.error("Send reset code error:", err);
    return res.status(500).json({ message: 'Server error while sending reset code' });
  }
});


// Step 1: Request recovery code
router.post('/request-code', async (req, res) => {
  const { email } = req.body;
  try {
    // First check in Graduate model with correct field name
    const graduate = await Graduate.findOne({ email: email });
    if (!graduate) return res.status(404).json({ message: 'Email not found in graduate records.' });

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000);
    recoveryCodes[email] = { code, expires: Date.now() + 15 * 60 * 1000 };

    // Send email with recovery code in tech-style format
    await transporter.sendMail({
      from: `"Alumni Recovery Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '[Secure Code Inside]',
      text: `
      Hey ${graduate.firstName || 'User'},

      Your temporary access code is:

       ${code}

      This code is valid for the next 15 minutes. If you didn't request this code, no worries — just ignore this message.

      System generated. No reply necessary.
            
      – DevOps Security // Alumni Recovery Portal
            `.trim(),
    });

    res.json({ message: 'Recovery code sent to graduate email.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error sending code.', error });
  }
});


// Step 2: Verify code
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  const entry = recoveryCodes[email];
  if (!entry || entry.code !== parseInt(code) || Date.now() > entry.expires) {
    return res.status(400).json({ message: 'Invalid or expired code.' });
  }
  // If code is valid, generate a token for password reset
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ message: 'Code verified.', token });
});

// Step 3: Reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const graduate = await Graduate.findOne({ email });
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate record not found.' });
    }

    console.log(" Graduate found during reset:", graduate);

    const fullName = `${graduate.firstName} ${graduate.lastName}`;
    const gradYear = graduate.gradYear;

    const student = await Student.findOne({
      firstName: new RegExp(`^${graduate.firstName}$`, 'i'),
      lastName: new RegExp(`^${graduate.lastName}$`, 'i'),
      gradyear: graduate.gradYear
    });     

    if (!student) {
      return res.status(404).json({ message: 'User not found. Cannot reset password.' });
    }
    
    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();    

    delete recoveryCodes[email];

    res.json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});



// Endpoint to get graduate's email
router.post('/get-graduate-email', async (req, res) => {
  const { firstName, lastName, gradYear } = req.body;

  console.log(" get-graduate-email called with:", req.body);

  try {
    const graduate = await Graduate.findOne({ 
      firstName: new RegExp(`^${firstName}$`, 'i'),
      lastName: new RegExp(`^${lastName}$`, 'i'),
      gradYear: Number(gradYear)
    });

    if (!graduate) {
      console.log(" No match in Graduate");
      return res.status(404).json({ message: 'Graduate not found' });
    }

    console.log(" Graduate found:", graduate);

    return res.json({ email: graduate.email });
  } catch (error) {
    console.error(" Server error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;