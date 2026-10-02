import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: String,
    title: String,
    message: String,
    type: {
      type: String,
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);