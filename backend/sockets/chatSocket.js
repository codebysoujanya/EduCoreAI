import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export default function registerChatSocket(io) {
  io.on("connection", (socket) => {
    console.log(
      "💬 Chat socket connected:",
      socket.id
    );


    /*
    ========================================
    JOIN CHAT
    ========================================
    */

    socket.on("join-chat", ({ conversationId }) => {
      if (!conversationId) {
        console.log(
          "⚠️ Conversation ID missing"
        );

        socket.emit("chat-error", {
          message:
            "Conversation ID is required.",
        });

        return;
      }

      const roomName =
        `chat-${conversationId}`;

      socket.join(roomName);

      socket.data.conversationId =
        conversationId;

      console.log(
        `💬 User joined chat room: ${roomName}`
      );
    });


    /*
    ========================================
    SEND CHAT MESSAGE
    ========================================
    */

    socket.on(
      "chat-message",
      async (data) => {
        try {
          const {
            conversationId,
            senderId,
            receiverId,
            content = "",
            messageType = "text",
            audioUrl = "",
          } = data;


          if (
            !conversationId ||
            !senderId ||
            !receiverId
          ) {
            console.log(
              "⚠️ Missing chat message information"
            );

            socket.emit(
              "chat-error",
              {
                message:
                  "Missing message information",
              }
            );

            return;
          }


          /*
          Validate conversation
          */

          const conversation =
            await Conversation.findById(
              conversationId
            );

          if (!conversation) {
            socket.emit(
              "chat-error",
              {
                message:
                  "Conversation not found",
              }
            );

            return;
          }


          /*
          Create message
          */

          const message =
            await Message.create({
              conversationId,
              senderId,
              receiverId,
              content,
              messageType,
              audioUrl,
            });


          /*
          Update conversation
          */

          await Conversation.findByIdAndUpdate(
            conversationId,
            {
              lastMessage:
                messageType === "audio"
                  ? "🎤 Voice message"
                  : content,

              lastMessageAt:
                new Date(),
            }
          );


          /*
          Send message to everyone
          in this conversation
          */

          io.to(
            `chat-${conversationId}`
          ).emit(
            "new-message",
            message
          );


          console.log(
            `💬 Message sent in conversation ${conversationId}`
          );

        } catch (error) {
          console.error(
            "❌ Chat message error:",
            error
          );

          socket.emit(
            "chat-error",
            {
              message:
                "Unable to send message",
            }
          );
        }
      }
    );


    /*
    ========================================
    TYPING
    ========================================
    */

    socket.on(
      "typing",
      ({ conversationId, userId }) => {
        if (!conversationId) {
          return;
        }

        socket
          .to(
            `chat-${conversationId}`
          )
          .emit(
            "user-typing",
            {
              userId,
            }
          );
      }
    );


    /*
    ========================================
    STOP TYPING
    ========================================
    */

    socket.on(
      "stop-typing",
      ({ conversationId, userId }) => {
        if (!conversationId) {
          return;
        }

        socket
          .to(
            `chat-${conversationId}`
          )
          .emit(
            "user-stop-typing",
            {
              userId,
            }
          );
      }
    );


    /*
    ========================================
    DISCONNECT
    ========================================
    */

    socket.on(
      "disconnect",
      () => {
        console.log(
          "💬 Chat socket disconnected:",
          socket.id
        );
      }
    );
  });
}