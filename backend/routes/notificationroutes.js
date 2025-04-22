import express from 'express';
import { sendSingleEmailNotification } from '../emailservice.js';

const router = express.Router();

router.post('/send-notification', async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await sendSingleEmailNotification(subject, message, email);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;