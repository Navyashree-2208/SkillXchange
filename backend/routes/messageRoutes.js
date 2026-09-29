const express = require('express')
const {firebaseAuthMiddleware} = require('../middleware/authMiddleware')
const {sendMessage, allMessages} = require('../controllers/messageController')

const router = express.Router()

router.route('/').post(firebaseAuthMiddleware, sendMessage)
router.route('/:chatId').get(firebaseAuthMiddleware, allMessages)

module.exports = router