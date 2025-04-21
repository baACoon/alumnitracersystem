import nodemailer from "nodemailer";
import dotenv from "dotenv";

import { SurveySubmission } from "./routes/surveyroutes.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "zoetobypalomo@gmail.com",
        pass: "rfrqdqqviczerxxx",
    },
});

// Send email notification to one email
export const sendEmailNotification = async (subject, message) => {
    try {
      console.log("Fetching alumni emails for tracer notification...");
      const users = await SurveySubmission.find({}, "personalInfo.email_address personalInfo.fullname");
  
      const recipients = users.map((user) => ({
        email: user.personalInfo.email_address,
        name: user.personalInfo.fullname || "Alumni"
      }));
  
      console.log("Target emails:", recipients);
  
      if (recipients.length === 0) {
        console.log("No emails found, skipping tracer reminders.");
        return;
      }
  
      for (const { email, name } of recipients) {
        try {
          if (!validateEmail(email)) {
            console.warn(`Skipping invalid email: ${email}`);
            continue;
          }
  
          // Replace {{name}} placeholder with actual name
          const personalizedText = message.replace(/\{\{name\}\}/g, name);
          const personalizedHTML = `<p>${personalizedText.replace(/\n/g, "<br>")}</p>`;
  
          const mailOptions = {
            from: `"TUPATS Team" <zoetobypalomo@gmail.com>`, // ✅ Friendly display name
            to: email,
            subject: subject,
            text: personalizedText, // ✅ Plain text fallback
            html: personalizedHTML  // ✅ HTML version
          };
  
          await transporter.sendMail(mailOptions);
          console.log(`✅ Email sent to: ${email}`);
        } catch (error) {
          console.error(`❌ Failed to send to ${email}:`, error.message);
        }
      }
    } catch (error) {
      console.error("❌ Error sending notification emails:", error);
    }
  };

export const sendArticleNotification = async (articleTitle, articleContent) => {
    try {
        console.log("Fetching user emails...");
        const users = await SurveySubmission.find({}, "personalInfo.email_address");
        console.log("Users fetched:", users);

        const emails = users.map((user) => user.personalInfo.email_address);
        console.log("Emails to send:", emails);
        
        if (emails.length === 0){
            console.log("No emails found, skipping notifications. ");
            return;
        }

      
        // **padala ng emails isa-isa**
        for (const email of emails) {
            try {
                // check kung valid ang email format
                if (!validateEmail(email)) {
                    console.warn(`Skipping invalid email: ${email}`);
                    continue; // Skip invalid email
                }

                // Email content
                const mailOptions = {
                    from: "zoetobypalomo@gmail.com",
                    to: email,
                    subject: `New Article: ${articleTitle}`,
                    html: `
                        <h2>${articleTitle}</h2>
                        <p>${articleContent}</p>
                        <p><a href="https://tupalumni.com">Read more</a></p>
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log(`Email sent successfully to: ${email}`);
            } catch (error) {
                console.error(`Failed to send email to ${email}:`, error.message);
            }
        }
            } catch (error) {
                console.error("Error sending email notifications:", error);
            }
    };

    // Function para i-validate ang email format
        const validateEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };


        export const sendEventNotification = async (eventTitle, eventDetails, eventDate) => {
            try {
                console.log("Fetching user emails for event notification...");
                const users = await SurveySubmission.find({}, "personalInfo.email_address");
        
                const emails = users.map((user) => user.personalInfo.email_address);
                console.log("Emails to send event notification:", emails);
        
                if (emails.length === 0) {
                    console.log("No emails found, skipping event notifications.");
                    return;
                }
        
                // **one at a time email**
                for (const email of emails) {
                    try {
        
                        // Email content
                        const mailOptions = {
                            from: "zoetobypalomo@gmail.com",
                            to: email,
                            subject: `New Event: ${eventTitle}`,
                            html: `
                                <h2>${eventTitle}</h2>
                                <p>${eventDetails}</p>
                                <p><strong>Date:</strong> ${eventDate}</p>
                                <p><a href="https://tupalumni.com">View Event Details</a></p>
                            `,
                        };
        
                        await transporter.sendMail(mailOptions);
                        console.log(`Event email sent successfully to: ${email}`);
                    } catch (error) {
                        console.error(`Failed to send event email to ${email}:`, error.message);
                    }
                }
            } catch (error) {
                console.error("Error sending event notifications:", error);
            }
        };
        
