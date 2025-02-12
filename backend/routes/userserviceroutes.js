import express from "express"
import { deleteUserAndBlacklist } from "../services/userservice.js"

const router = express.Router();

// DELETE user and add to blacklist
router.delete("/delete-user", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }

        await deleteUserAndBlacklist(email);
        res.status(200).json({ success: true, message: "User deleted and blacklisted." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete user." });
    }
});

export default router;