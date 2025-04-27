import express from 'express';
import { getChats, createChat, markMessagesAsSeen } from '../controllers/chat.controller.js';

const router = express.Router();

// Fetch chats between two users
router.get('/', getChats);

// Create a new chat message (optional)
router.post('/', createChat);

// Mark messages as seen
router.put('/seen', markMessagesAsSeen);

export default router;
