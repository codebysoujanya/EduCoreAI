import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    studentName: String,
    mentorId: String,
    date: String,
    time: String,
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);