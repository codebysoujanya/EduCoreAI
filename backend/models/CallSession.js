import mongoose from "mongoose";

const callSessionSchema = new mongoose.Schema(
  {
    callerId: {
      type: String,
      required: true,
    },

    receiverId: {
      type: String,
      required: true,
    },

    callType: {
      type: String,
      enum: ["audio", "video"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "calling",
        "connected",
        "completed",
        "rejected",
        "missed",
      ],
      default: "calling",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CallSession = mongoose.model(
  "CallSession",
  callSessionSchema
);

export default CallSession;