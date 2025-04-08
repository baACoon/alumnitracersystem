import mongoose from "mongoose";

const GraduateListSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String, required: true },
  college: { type: String },
  course: { type: String },
  email: { type: String, required: true },
  contact: { type: String }, // Keep contact field but make it optional
  tupId: { type: String }, // Add TUP-ID field
  gradYear: { type: Number, required: true },
});

export default mongoose.model("Graduate", GraduateListSchema);
