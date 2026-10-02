import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import registerChatSocket from "./sockets/chatSocket.js";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("CORS blocked:", origin);

    return callback(
      new Error("Not allowed by CORS")
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(helmet());

app.use(cors(corsOptions));

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/*
====================================================
CHAT SOCKET
====================================================
*/

registerChatSocket(io);

/*
====================================================
VIDEO CALL ROOMS
====================================================
*/

const mentorRooms = new Map();

/*
====================================================
SOCKET.IO CONNECTION
====================================================
*/

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  /*
  ==================================================
  JOIN VIDEO ROOM
  ==================================================
  */

  socket.on("join-room", ({ roomId, role }) => {
    if (!roomId) {
      socket.emit("call-error", {
        message: "Room ID is required",
      });

      return;
    }

    if (!role) {
      socket.emit("call-error", {
        message: "Role is required",
      });

      return;
    }

    let room = mentorRooms.get(roomId);

    if (!room) {
      room = {
        student: null,
        mentor: null,
      };

      mentorRooms.set(roomId, room);
    }

    if (role === "student") {
      if (
        room.student &&
        room.student !== socket.id
      ) {
        socket.emit("call-error", {
          message:
            "A student is already in this call",
        });

        return;
      }

      room.student = socket.id;
    }

    if (role === "mentor") {
      if (
        room.mentor &&
        room.mentor !== socket.id
      ) {
        socket.emit("call-error", {
          message:
            "A mentor is already in this call",
        });

        return;
      }

      room.mentor = socket.id;
    }

    mentorRooms.set(roomId, room);

    socket.join(roomId);

    socket.data.roomId = roomId;
    socket.data.role = role;

    const participantCount =
      Number(Boolean(room.student)) +
      Number(Boolean(room.mentor));

    socket.emit("room-joined", {
      roomId,
      role,
      participantCount,
      waiting: participantCount < 2,
    });

    socket
      .to(roomId)
      .emit("participant-joined", {
        role,
        socketId: socket.id,
      });

    if (
      room.student &&
      room.mentor
    ) {
      io.to(roomId).emit("call-ready", {
        roomId,
      });

      console.log(
        "Call ready:",
        roomId
      );
    }
  });

  /*
  ==================================================
  WEBRTC OFFER
  ==================================================
  */

  socket.on(
    "offer",
    ({ room, offer }) => {
      if (!room || !offer) {
        return;
      }

      socket
        .to(room)
        .emit("offer", {
          offer,
          from: socket.id,
        });
    }
  );

  /*
  ==================================================
  WEBRTC ANSWER
  ==================================================
  */

  socket.on(
    "answer",
    ({ room, answer }) => {
      if (!room || !answer) {
        return;
      }

      socket
        .to(room)
        .emit("answer", {
          answer,
          from: socket.id,
        });
    }
  );

  /*
  ==================================================
  ICE CANDIDATE
  ==================================================
  */

  socket.on(
    "ice-candidate",
    ({ room, candidate }) => {
      if (!room || !candidate) {
        return;
      }

      socket
        .to(room)
        .emit("ice-candidate", {
          candidate,
          from: socket.id,
        });
    }
  );

  /*
  ==================================================
  END CALL
  ==================================================
  */

  socket.on(
    "end-call",
    ({ room }) => {
      if (!room) {
        return;
      }

      socket
        .to(room)
        .emit("call-ended", {
          socketId: socket.id,
        });

      const roomData =
        mentorRooms.get(room);

      if (!roomData) {
        return;
      }

      if (
        roomData.student ===
        socket.id
      ) {
        roomData.student = null;
      }

      if (
        roomData.mentor ===
        socket.id
      ) {
        roomData.mentor = null;
      }

      if (
        !roomData.student &&
        !roomData.mentor
      ) {
        mentorRooms.delete(room);
      } else {
        mentorRooms.set(
          room,
          roomData
        );
      }

      socket.leave(room);
    }
  );

  /*
  ==================================================
  DISCONNECT
  ==================================================
  */

  socket.on("disconnect", () => {
    console.log(
      "Socket disconnected:",
      socket.id
    );

    const roomId =
      socket.data.roomId;

    if (!roomId) {
      return;
    }

    const room =
      mentorRooms.get(roomId);

    if (!room) {
      return;
    }

    if (
      room.student ===
      socket.id
    ) {
      room.student = null;
    }

    if (
      room.mentor ===
      socket.id
    ) {
      room.mentor = null;
    }

    socket
      .to(roomId)
      .emit("call-ended", {
        socketId: socket.id,
      });

    if (
      !room.student &&
      !room.mentor
    ) {
      mentorRooms.delete(roomId);
    } else {
      mentorRooms.set(
        roomId,
        room
      );
    }
  });
});

/*
====================================================
TEST ROUTE
====================================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EduCoreAI Backend Running",
  });
});

app.get(
  "/api/test",
  (req, res) => {
    res.json({
      success: true,
      message: "API Working",
    });
  }
);

/*
====================================================
API ROUTES
====================================================
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/students",
  studentRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/agents",
  agentRoutes
);

/*
====================================================
MENTOR CHAT ROUTES
====================================================
*/

app.use(
  "/api/messages",
  messageRoutes
);

/*
====================================================
404
====================================================
*/

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  }
);

/*
====================================================
ERROR HANDLER
====================================================
*/

app.use(
  (err, req, res, next) => {
    console.error(
      "Server Error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });
  }
);

/*
====================================================
START SERVER
====================================================
*/

const startServer = async () => {
  try {
    await connectDB();

    console.log(
      "MongoDB Connected"
    );

    server.listen(
      PORT,
      () => {
        console.log("");
        console.log(
          "===================================="
        );
        console.log(
          "EDUCORE AI BACKEND"
        );
        console.log(
          "===================================="
        );
        console.log(
          `Server: http://localhost:${PORT}`
        );
        console.log(
          `API: http://localhost:${PORT}/api/test`
        );
        console.log(
          `Chat: http://localhost:${PORT}/api/messages`
        );
        console.log(
          "Socket.IO: Enabled"
        );
        console.log(
          "WebRTC: Enabled"
        );
        console.log(
          "Agentic AI: Enabled"
        );
        console.log(
          "===================================="
        );
        console.log("");
      }
    );
  } catch (error) {
    console.error(
      "Server startup failed:"
    );

    console.error(error);

    process.exit(1);
  }
};

startServer();
