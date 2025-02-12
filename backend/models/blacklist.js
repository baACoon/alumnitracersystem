import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  reason: { type: String, default: "User requested removal or exceeded limit" },
  createdAt: { type: Date, default: Date.now },
});

const Blacklist = mongoose.model("Blacklist", blacklistSchema);

export default Blacklist;
