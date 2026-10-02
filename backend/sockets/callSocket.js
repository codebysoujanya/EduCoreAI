const CallSession = require("../models/CallSession");

function registerCallSocket(io) {
  io.on("connection", (socket) => {
    console.log("📞 Call socket connected:", socket.id);

    // Every user gets a private socket room
    socket.on("join-user", (userId) => {
      if (!userId) return;

      socket.join(`user-${userId}`);

      console.log(
        `👤 User ${userId} joined private call room`
      );
    });

    // Start audio/video call
    socket.on("call-user", async (data) => {
      try {
        const {
          to,
          from,
          callType,
          callSessionId,
        } = data;

        if (!to || !from || !callType) {
          return;
        }

        io.to(`user-${to}`).emit("incoming-call", {
          from,
          callType,
          callSessionId,
          socketId: socket.id,
        });

        console.log(
          `📲 ${callType} call from ${from} to ${to}`
        );
      } catch (error) {
        console.error("❌ Call error:", error);
      }
    });

    // WebRTC offer
    socket.on("call-offer", ({ to, offer }) => {
      if (!to || !offer) return;

      io.to(`user-${to}`).emit("call-offer", {
        offer,
        from: socket.id,
      });
    });

    // WebRTC answer
    socket.on("call-answer", ({ to, answer }) => {
      if (!to || !answer) return;

      io.to(`user-${to}`).emit("call-answer", {
        answer,
        from: socket.id,
      });
    });

    // WebRTC ICE candidate
    socket.on("ice-candidate", ({ to, candidate }) => {
      if (!to || !candidate) return;

      io.to(`user-${to}`).emit("ice-candidate", {
        candidate,
        from: socket.id,
      });
    });

    // Call connected
    socket.on("call-connected", async ({ callSessionId }) => {
      try {
        if (!callSessionId) return;

        await CallSession.findByIdAndUpdate(
          callSessionId,
          {
            status: "connected",
            startedAt: new Date(),
          }
        );

        console.log(
          `✅ Call connected: ${callSessionId}`
        );
      } catch (error) {
        console.error(
          "❌ Call connected error:",
          error
        );
      }
    });

    // Reject call
    socket.on(
      "call-rejected",
      async ({ to, callSessionId }) => {
        try {
          if (to) {
            io.to(`user-${to}`).emit("call-rejected");
          }

          if (callSessionId) {
            await CallSession.findByIdAndUpdate(
              callSessionId,
              {
                status: "rejected",
                endedAt: new Date(),
              }
            );
          }
        } catch (error) {
          console.error(
            "❌ Call rejection error:",
            error
          );
        }
      }
    );

    // End call
    socket.on(
      "end-call",
      async ({ to, callSessionId }) => {
        try {
          if (to) {
            io.to(`user-${to}`).emit("call-ended");
          }

          if (callSessionId) {
            const call =
              await CallSession.findById(
                callSessionId
              );

            if (call) {
              const endedAt = new Date();

              let duration = 0;

              if (call.startedAt) {
                duration = Math.floor(
                  (endedAt - call.startedAt) / 1000
                );
              }

              await CallSession.findByIdAndUpdate(
                callSessionId,
                {
                  status: "completed",
                  endedAt,
                  duration,
                }
              );
            }
          }

          console.log(
            `📴 Call ended: ${callSessionId || "unknown"}`
          );
        } catch (error) {
          console.error(
            "❌ End call error:",
            error
          );
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(
        "📞 Call socket disconnected:",
        socket.id
      );
    });
  });
}

module.exports = registerCallSocket;