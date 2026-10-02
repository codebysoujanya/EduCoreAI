import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: String,
      required: true,
    },

    receiverId: {
      type: String,
      required: true,
    },

    messageType: {
      type: String,
      enum: ["text", "audio", "system"],
      default: "text",
    },

    content: {
      type: String,
      default: "",
    },

    audioUrl: {
      type: String,
      default: "",
    },

    seen: {
      type: Boolean,
      default: false,
    },

    aiProcessed: {
      type: Boolean,
      default: false,
    },

    emotion: {
      type: String,
      default: "",
    },

    intent: {
      type: String,
      default: "",
    },

    mentorEscalated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);