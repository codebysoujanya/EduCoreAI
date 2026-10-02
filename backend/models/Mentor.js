import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    skills: [String],
    experience: String,
    rating: Number,
    image: String,
    bio: String,
  },
  { timestamps: true }
);

export default mongoose.model("Mentor", mentorSchema);