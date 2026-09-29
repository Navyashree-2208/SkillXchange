const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageSchema");
const User = require("../models/UserSchema");
const Chat = require("../models/ChatSchema");
const { all } = require("../routes/chatRoutes");

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Content or chatId not sent with request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await Message.findById(message._id)
          .populate("sender", "User.Personal_info.Username User.Personal_info.ProfilePicture")
          .populate("chat")
          .populate({
            path: 'chat.users',
            select: 'User.Personal_info.Username User.Personal_info.ProfilePicture User.Personal_info.Email'
          });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message._id,
        });

        res.json(message);
    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(400).json({ message: error.message });
    }
});

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
          .populate("sender", "User.Personal_info.Username User.Personal_info.ProfilePicture User.Personal_info.Email")
          .populate("chat")
          
          res.json(messages)
    } catch (error) {
        console.error("Error fetching messages:", error.message);
        res.status(400).json({ message: error.message });
    }
});

module.exports = { sendMessage, allMessages };
