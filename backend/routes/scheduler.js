import cron from 'node-cron';
import axios from 'axios';

// Schedule the task to run every minute for testing
cron.schedule('0 8 1 * *', async () => {
  console.log('⏰ Running email notification task...');
  try {
    await axios.post('http://localhost:5050/api/notifications/sendMonthlyReminders');
    console.log(' Email notifications sent successfully.');
  } catch (error) {
    console.error('Error sending email notifications:', error.message);
  }
});

console.log('Scheduler initialized.');