require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const messageRoutes = require('./routes/message.routes');
const userRouter = require('./routes/user.routes');
const Message = require('./models/Messages.model');

const { createServer } = require('node:http');
const { Server } = require('socket.io');



mongoose.connect('mongodb+srv://lalitkp0101_db_user:4fbmvi6HtKTnGWnC@cluster0.xv0bryn.mongodb.net/chat-app')
  .then(() => console.log('Connected To Database'))
  .catch(err => console.log(err));

  // mongodb+srv://lalitkp0101_db_user:4fbmvi6HtKTnGWnC@cluster0.xv0bryn.mongodb.net/
  // mongodb+srv://lalitkp0101_db_user:4fbmvi6HtKTnGWnC@cluster0.xv0bryn.mongodb.net/

app.use(cors());  // REST API CORS
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "4mb" }));


app.use('/api/auth', userRouter);
app.use('/api/messages', messageRoutes);

// ====== Create HTTP + Socket.IO server ======
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-fronted-g3fi2i5ws-bylalits-projects.vercel.app",
    methods: ["GET", "POST"]
  }
});

// ====== Socket.IO Events ======
io.on('connection', (socket) => {
  console.log('A User Connected: ' + socket.id);

  // Listen for incoming messages from client
  socket.on('sendMessage', async (msg) => {
    try {
      const newMessage = new Message({
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        message: msg.message
      });

      await newMessage.save();

      // Emit to all connected clients
      io.emit('receiveMessage', newMessage);

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Optional: disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

// ====== Start Server ======
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
