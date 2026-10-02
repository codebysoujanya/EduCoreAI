import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // JOIN USER ROOM
    socket.on("join_room", (userId) => {
      socket.join(userId);
      console.log(`User joined room: ${userId}`);
    });

    // CHAT MESSAGE
    socket.on("send_message", (data) => {
      io.to(data.receiverId).emit("receive_message", data);
    });

    // AI LIVE RESPONSE (optional future use)
    socket.on("ai_typing", (userId) => {
      socket.to(userId).emit("ai_typing");
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;