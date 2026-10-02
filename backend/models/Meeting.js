import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    meetingId: {
      type: String,
      required: true,
      unique: true,
    },

    hostId: {
      type: String,
      required: true,
    },

    studentId: {
      type: String,
      default: "",
    },

    mentorId: {
      type: String,
      default: "",
    },

    meetingType: {
      type: String,
      enum: ["audio", "video"],
      default: "video",
    },

    title: {
      type: String,
      default: "Mentor Meeting",
    },

    scheduledAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "active",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model(
  "Meeting",
  meetingSchema
);

export default Meeting;