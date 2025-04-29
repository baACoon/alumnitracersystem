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


  // ✅ Send email notification to a SINGLE alumni
export const sendSingleEmailNotification = async (subject, message, recipientEmail) => {
    try {
      console.log("🎯 Sending single email to:", recipientEmail);
  
      const user = await SurveySubmission.findOne(
        { "personalInfo.email_address": recipientEmail },
        "personalInfo.email_address personalInfo.fullname"
      );
  
      if (!user) {
        console.log(`No alumni found with email: ${recipientEmail}`);
        return;
      }
  
      const email = user.personalInfo.email_address;
      const name = user.personalInfo.fullname || "Alumni";
  
      if (!validateEmail(email)) {
        console.warn(`Invalid email address provided: ${email}`);
        return;
      }
  
      const personalizedText = message.replace(/\{\{name\}\}/g, name);
      const personalizedHTML = `<p>${personalizedText.replace(/\n/g, "<br>")}</p>`;
  
      const mailOptions = {
        from: `"TUPATS Team" <zoetobypalomo@gmail.com>`,
        to: email,
        subject,
        text: personalizedText,
        html: personalizedHTML
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email successfully sent to: ${email}`);
    } catch (error) {
      console.error("❌ Error sending notification email:", error);
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
                    from: `"TUPATS Team" <zoetobypalomo@gmail.com>`,
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
                            from: `"TUPATS Team" <zoetobypalomo@gmail.com>`,
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
        
        export const sendJobNotification = async (jobTitle, company, description) => {
            try {
                console.log("Fetching user emails for job notification...");
                const users = await SurveySubmission.find({}, "personalInfo.email_address");
        
                const emails = users.map((user) => user.personalInfo.email_address).filter(validateEmail);
        
                for (const email of emails) {
                    const mailOptions = {
                        from: `"TUPATS Team" <zoetobypalomo@gmail.com>`,
                        to: email,
                        subject: `New Job Opportunity: ${jobTitle} at ${company}`,
                        html: `
                            <h2>${jobTitle}</h2>
                            <p><strong>Company:</strong> ${company}</p>
                            <p>${description}</p>
                            <p><a href="https://tupalumni.com">View Job Listings</a></p>
                        `,
                    };
        
                    await transporter.sendMail(mailOptions);
                    console.log(`Job email sent to: ${email}`);
                }
            } catch (error) {
                console.error("Error sending job notifications:", error);
            }
        };
        