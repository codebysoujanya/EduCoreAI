import mongoose from "mongoose";

const aiSuggestionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "guest",
    },
    prompt: String,
    response: String,
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("AISuggestion", aiSuggestionSchema);