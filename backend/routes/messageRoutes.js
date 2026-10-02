import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const router = express.Router();

/*
========================================
CREATE OR GET CONVERSATION
========================================
POST /api/messages/conversations
*/

router.post("/conversations", async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    if (!studentId || !mentorId) {
      return res.status(400).json({
        success: false,
        message: "studentId and mentorId are required",
      });
    }

    let conversation = await Conversation.findOne({
      studentId,
      mentorId,
      isActive: true,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [studentId, mentorId],
        studentId,
        mentorId,
        lastMessage: "",
        lastMessageAt: new Date(),
        isActive: true,
      });

      console.log(
        `💬 New conversation created: ${conversation._id}`
      );
    } else {
      console.log(
        `💬 Existing conversation found: ${conversation._id}`
      );
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("❌ Conversation creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create conversation",
    });
  }
});


/*
========================================
GET CONVERSATION MESSAGES
========================================
GET /api/messages/conversations/:conversationId/messages
*/

router.get(
  "/conversations/:conversationId/messages",
  async (req, res) => {
    try {
      const { conversationId } = req.params;

      if (!conversationId) {
        return res.status(400).json({
          success: false,
          message: "Conversation ID is required",
        });
      }

      const messages = await Message.find({
        conversationId,
      }).sort({
        createdAt: 1,
      });

      return res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error("❌ Message fetch error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to load messages",
      });
    }
  }
);


/*
========================================
GET CONVERSATION DETAILS
========================================
GET /api/messages/conversations/:conversationId
*/

router.get(
  "/conversations/:conversationId",
  async (req, res) => {
    try {
      const { conversationId } = req.params;

      const conversation = await Conversation.findById(
        conversationId
      );

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        conversation,
      });
    } catch (error) {
      console.error(
        "❌ Conversation fetch error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to load conversation",
      });
    }
  }
);


/*
========================================
SEND MESSAGE THROUGH REST
========================================
POST /api/messages
*/

router.post("/", async (req, res) => {
  try {
    const {
      conversationId,
      senderId,
      receiverId,
      content = "",
      messageType = "text",
      audioUrl = "",
    } = req.body;

    if (
      !conversationId ||
      !senderId ||
      !receiverId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "conversationId, senderId and receiverId are required",
      });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      receiverId,
      content,
      messageType,
      audioUrl,
    });

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage:
          messageType === "audio"
            ? "🎤 Voice message"
            : content,

        lastMessageAt: new Date(),
      }
    );

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("❌ Send message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send message",
    });
  }
});


export default router;