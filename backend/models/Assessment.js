import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    userId: String,
    answers: Array,
    score: Number,
    level: String,
    recommendation: String,
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);