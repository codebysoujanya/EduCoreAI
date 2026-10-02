import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: String,
    email: String,
    phone: String,
    branch: String,
    year: String,

    academicScore: Number,
    attendance: Number,

    emotion: String,
    behavior: String,
    personality: String,

    skills: [String],
    hobbies: [String],

    goals: String,
    notes: String,

    riskScore: {
      type: Number,
      default: 0,
    },

    timestamp: String,
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);