// 📂 api/controllers/socket.controller.js

import Chat from '../models/chat.model.js';

let onlineUsers = {};

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    socket.on('addUser', (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit('updateOnlineUsers', Object.keys(onlineUsers));
    });

    socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
      const message = {
        senderId,
        receiverId,
        text,
        seen: false,
        createdAt: new Date()
      };

      // Emit to both users (sender and receiver)
      io.emit('receiveMessage', message);

      // Save message to MongoDB
      try {
        await Chat.create(message);
      } catch (err) {
        console.error('❌ Error saving chat:', err.message);
      }
    });

    socket.on('typing', ({ senderId, receiverId }) => {
      io.emit('typing', { senderId, receiverId });
    });

    socket.on('stopTyping', ({ senderId, receiverId }) => {
      io.emit('stopTyping', { senderId, receiverId });
    });

    socket.on('disconnect', () => {
      const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
      if (userId) {
        delete onlineUsers[userId];
      }
      io.emit('updateOnlineUsers', Object.keys(onlineUsers));
      console.log('❌ User disconnected:', socket.id);
    });
  });
};
