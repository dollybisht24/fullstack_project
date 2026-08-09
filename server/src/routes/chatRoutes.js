const express = require('express');
const router = express.Router();
const {
  getChatSession,
  sendMessage,
  getChatHistory,
  clearChatSession,
  getUserChatSessions
} = require('../controllers/chatControllerSimple');

// Chat routes
router.get('/session', getChatSession);
router.post('/message', sendMessage);
router.get('/history/:sessionId', getChatHistory);
router.delete('/session/:sessionId', clearChatSession);
router.get('/sessions/:userId', getUserChatSessions);

module.exports = router;
