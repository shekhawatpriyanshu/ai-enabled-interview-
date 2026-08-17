const dotenv = require("dotenv");
dotenv.config();
const User = require("./models/user");
const Admin = require("./models/admin");
const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const http = require("http");
const { Server } = require("socket.io");

console.log("JWT_SECRET =", process.env.JWT_SECRET);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("socketio", io);
global.socketIo = io; // Expose globally for Mongoose hooks

const initLiveInterviewSocket = require("./sockets/liveInterviewSocket");
initLiveInterviewSocket(io);

const onlineUsers = new Map();

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

// Default Socket Handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user_online", async (userId) => {
    socket.userId = userId;
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    try {
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        socketId: socket.id,
        lastSeen: new Date(),
      });
    } catch (e) {}

    io.emit("active_users_count", onlineUsers.size);
  });

  socket.on("logout", async () => {
    if (!socket.userId) return;
    const sockets = onlineUsers.get(socket.userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(socket.userId);
        try {
          await User.findByIdAndUpdate(socket.userId, {
            isOnline: false,
            socketId: null,
            lastSeen: new Date(),
          });
        } catch (e) {}
      }
    }
    io.emit("active_users_count", onlineUsers.size);
    socket.disconnect(true);
  });

  socket.on("disconnect", async () => {
    if (socket.userId) {
      const sockets = onlineUsers.get(socket.userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(socket.userId);
          try {
            await User.findByIdAndUpdate(socket.userId, {
              isOnline: false,
              socketId: null,
              lastSeen: new Date(),
            });
          } catch (e) {}
        }
      }
      io.emit("active_users_count", onlineUsers.size);
    }
  });
});

const startServer = async () => {
  try {
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`\n⚠️ Port ${PORT} is already in use by another process.`);
        console.error(`👉 Waiting for port ${PORT} to free up... (Nodemon will retry automatically)\n`);
        setTimeout(() => {
          server.close();
          server.listen(PORT);
        }, 5000);
      } else {
        console.error("Server error:", err);
      }
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server Running On Port ${PORT}`);
    });

    connectDB()
      .then(async () => {
        try {
          const mongoose = require("mongoose");
          if (mongoose.connection.readyState === 1) {
            console.log("Database:", mongoose.connection.name);
            console.log("Users:", await User.countDocuments({}));
            console.log("Admins:", await Admin.countDocuments({}));

            await User.updateMany(
              {},
              {
                isOnline: false,
                socketId: null,
              }
            );
            console.log("Reset all online users to offline on startup.");
          }
        } catch (dbErr) {
          console.warn("DB initial query warning:", dbErr.message);
        }
      })
      .catch((err) => {
        console.warn("Initial DB connection warning:", err.message);
      });

    const shutdown = () => {
      server.close(() => {
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    process.once("SIGUSR2", () => {
      server.close(() => {
        process.kill(process.pid, "SIGUSR2");
      });
    });
  } catch (error) {
    console.log("Server startup failed:", error.stack);
  }
};

startServer();