require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const compression = require("compression");

const { createServer } = require("node:http");
const { Server } = require("socket.io");

const messageRoutes = require("./routes/message.routes");
const userRouter = require("./routes/user.routes");
const Message = require("./models/Messages.model");

const app = express();

mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://lalitkp0101_db_user:4fbmvi6HtKTnGWnC@cluster0.xv0bryn.mongodb.net/chat-app"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

//  MIDDLEWARES (CORRECT ORDER)
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://chat-fronted-g3fi2i5ws-bylalits-projects.vercel.app",
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.options('*', cors());

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "4mb" }));

app.use(compression());

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRoutes);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:4200",
      "https://chat-fronted-g3fi2i5ws-bylalits-projects.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("sendMessage", async (msg) => {
    try {
      const newMessage = new Message({
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        message: msg.message,
      });

      await newMessage.save();

      // Send message to all users
      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Message Save Error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
