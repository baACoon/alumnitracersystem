import mongoose from "mongoose";

const graduateSchema = new mongoose.Schema({
  name: String,
  email: String,
  college: String,
});


const Graduate = mongoose.models.Graduate || mongoose.model("Graduate", graduateSchema);

export default Graduate;
