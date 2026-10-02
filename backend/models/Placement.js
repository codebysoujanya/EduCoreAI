import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    studentId: String,
    company: String,
    role: String,
    package: String,
    status: {
      type: String,
      default: "applied",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Placement", placementSchema);