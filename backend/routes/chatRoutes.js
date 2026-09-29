const express = require('express');
const { 
    accessChat, 
    fetchChats, 
    markChatAsRead 
} = require('../controllers/chatController');
const { firebaseAuthMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(firebaseAuthMiddleware, accessChat);
router.route('/').get(firebaseAuthMiddleware, fetchChats);
router.route('/:chatId/read').post(firebaseAuthMiddleware, markChatAsRead);

module.exports = router;