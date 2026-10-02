import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: String,

  title: String,

  progress: {
    type: Number,
    default: 0,
  },

  completed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Goal", goalSchema);