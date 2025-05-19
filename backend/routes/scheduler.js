import cron from 'node-cron';
import axios from 'axios';

// Schedule the task to run every minute for testing
cron.schedule('0 8 1 * *', async () => {
  console.log('⏰ Running email notification task...');
  try {
    await axios.post('https://alumnitracersystem.onrender.com/api/notifications/sendMonthlyReminders');
    console.log(' Email notifications sent successfully.');
  } catch (error) {
    console.error('Error sending email notifications:', error.message);
  }
});

// Monthly check for unemployed alumni - runs at 9:00 AM on the 1st day of every month ONLY
cron.schedule('0 9 1 * *', async () => {
  console.log('🔍 Starting monthly unemployment check...');
  
  try {
    // Send reminders to unemployed alumni
    const response = await axios.post('https://alumnitracersystem.onrender.com/api/notifications/sendUnemployedAlumniReminders');
    
    if (response.data.message === 'No unemployed alumni to notify.') {
      console.log('✅ No unemployed alumni found - all alumni are employed!');
      return;
    }

    console.log(`📧 Monthly reminders sent to ${response.data.alumniNotified} unemployed alumni`);
    console.log('⏰ Next check scheduled for first day of next month');

  } catch (error) {
    console.error('❌ Failed to send reminders:', error.message);
    console.error('Please check:');
    console.error('1. Database connectivity');
    console.error('2. Email service status');
    console.error('3. Network connection');
  }
});

/* Optional: Add a test trigger for development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development mode: Adding test trigger');
  // Test trigger runs every 5 minutes in development
  cron.schedule('5 * * * *', async () => {
    console.log('🧪 Running test check for unemployed alumni...');
    await attemptSendEmails();
  });

  date hired
  date graduated
  month & year of batch
  management ng batch (month of graduate "september 2025") - para macompute ilang months
  after grumaduate
  lagyan ng period like in less than 6 months, less than 2 years

}*/

console.log('📅 Unemployment check scheduler initialized');
console.log('ℹ️ Emails will be sent at 9:00 AM on the first day of each month only');