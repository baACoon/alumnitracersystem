import express from 'express';
import { sendEmailNotification } from '../emailservice.js';

const router = express.Router();

router.post('/send-notification', async (req, res) => {
    const { email, subject, message } = req.body;

    try {
        await sendEmailNotification(email, subject, message);
        res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
