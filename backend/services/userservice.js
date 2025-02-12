import Blacklist from "../models/blacklist.js";
import { SurveySubmission } from "../routes/surveyroutes.js";

/**
 * Function para tanggalin ang user at ilagay sa blacklist.
 * @param {string} email - Email address ng user na tatanggalin
 */
export const deleteUserAndBlacklist = async (email) => {
    try {
        // Hanapin at tanggalin ang user sa MongoDB
        const deletedUser = await SurveySubmission.findOneAndDelete({ "personalInfo.email_address": email });

        if (deletedUser) {
            // I-save ang email sa blacklist
            await Blacklist.create({ email });
            console.log(`Email blacklisted: ${email}`);
        } else {
            console.log("Email not found, skipping blacklist.");
        }
    } catch (error) {
        console.error("Error deleting user or blacklisting email:", error);
    }
};