// 📂 api/controllers/chat.controller.js

import Chat from '../models/chat.model.js';
import { errorHandler } from '../utils/error.js';

// Create a chat manually (optional)
export const createChat = async (req, res, next) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const chat = await Chat.create({ senderId, receiverId, text, seen: false });
    res.status(201).json(chat);
  } catch (err) {
    next(errorHandler(500, 'Failed to create chat.'));
  }
};

// Fetch all chats between two users
export const getChats = async (req, res, next) => {
  try {
    const { user1, user2 } = req.query;
    const chats = await Chat.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort('createdAt');
    res.status(200).json(chats);
  } catch (err) {
    next(errorHandler(500, 'Failed to fetch chats.'));
  }
};

// Mark messages as seen
export const markMessagesAsSeen = async (req, res, next) => {
  try {
    const { userId } = req.body;
    await Chat.updateMany({ receiverId: userId, seen: false }, { $set: { seen: true } });
    res.status(200).json({ message: 'All messages marked as seen.' });
  } catch (err) {
    next(errorHandler(500, 'Failed to mark messages as seen.'));
  }
};
