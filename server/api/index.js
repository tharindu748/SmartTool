import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io'; // ✅ import socket.io server
import http from 'http'; // ✅ import Node.js http module
import Chat from './models/chat.model.js'; // ✅ Chat model import
import { socketHandler } from './controllers/socket.controller.js';

// Routes imports
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import authSupplierRoutes from './routes/authSupplier.routes.js';
import authExpertRoutes from './routes/authExperts.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import productRoutes from './routes/product.route.js';
import expertRoute from './routes/expert.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import chatRoutes from './routes/chat.routes.js';

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ Correct CORS setup
app.use(cors({
  origin: 'http://localhost:5173', // React frontend port
  credentials: true,
}));

// Route setup
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api', authSupplierRoutes);
app.use('/api', authExpertRoutes);
app.use('/api/supplier', supplierRoutes); // ✅
app.use('/api/products', productRoutes);
app.use('/api/expert', expertRoute);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chats', chatRoutes);

// Global error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Create HTTP Server
const server = http.createServer(app);

// ✅ Create Socket.io Server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

socketHandler(io); // <-- ✅ very clean!

// ✅ Socket.io connection handling
let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('addUser', (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit('updateOnlineUsers', Object.keys(onlineUsers));
  });

  socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
    try {
      // ✅ Save chat message to MongoDB
      const newMessage = new Chat({
        senderId,
        receiverId,
        text,
        seen: false,
      });

      await newMessage.save();

      // ✅ Emit saved message to clients
      io.emit('receiveMessage', {
        _id: newMessage._id,
        senderId,
        receiverId,
        text,
        createdAt: newMessage.createdAt,
        seen: newMessage.seen,
      });

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('typing', ({ senderId, receiverId }) => {
    io.emit('typing', { senderId, receiverId });
  });

  socket.on('stopTyping', ({ senderId, receiverId }) => {
    io.emit('stopTyping', { senderId, receiverId });
  });

  socket.on('disconnect', () => {
    const userId = Object.keys(onlineUsers).find((key) => onlineUsers[key] === socket.id);
    if (userId) {
      delete onlineUsers[userId];
    }
    io.emit('updateOnlineUsers', Object.keys(onlineUsers));
    console.log('User disconnected:', socket.id);
  });
});

// ✅ Start the server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
