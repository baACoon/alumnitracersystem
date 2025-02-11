import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { SurveySubmission } from "./routes/surveyroutes.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "hostingersiasia@gmail.com",
        pass: "gfrixatxurpwymwz",
    },
});

export const sendArticleNotification = async (articleTitle, articleContent) => {
    try {
        const users = await SurveySubmission.find({}, "personalInfo.email_address:");
        console.log("Users fetched:", users);

        const emails = users.map((user) => user.personalInfo.email_address);
        console.log("Emails to send:", emails);
        
        if (emails.length === 0){
            console.log("No emails found, skipping notifications. ");
            return;
        }

        //email content 
        const mailOption ={ 
            from: "hostingersiasia@gmail.com",
            to: emails.join(","),
            subject: 'New Article: ${articleTitle}',
            html: `
                <h2>${articleTitle}</h2>
                <p>${articleContent}</p>
                <p><a href="https://tupalumni.com/news">Read more</a></p>
            `,
        };

                // Send email
                await transporter.sendMail(mailOptions);
                console.log(" Email notifications sent successfully!");
            } catch (error) {
                console.error(" Error sending email notifications:", error);
            }
    }
