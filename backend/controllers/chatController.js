const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatSchema");
const User = require("../models/UserSchema");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    const currentUser = await User.findOne({ "User.Personal_info.Email": req.user.email });

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found in the database" });
    }

    const otherUser = await User.findById(userId);

    if (!otherUser) {
      return res.status(404).json({ message: "Other user not found in database" });
    }

    var isChat = await Chat.find({
        users: { $all: [{ $elemMatch: { $eq: currentUser._id } }, { $elemMatch: { $eq: otherUser._id } }] }
    })
      .populate("users", "-User.Personal_info.Password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "User.Personal_info.Username User.Personal_info.Email User.Personal_info.profilePicture",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        users: [currentUser._id, otherUser._id],
      };

      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-User.Personal_info.Password");

      res.status(200).json(FullChat);
    }
  } catch (error) {
    console.error("Error accessing chat:", error.message);
    res.status(400).json({ message: error.message });
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const currentUser = await User.findOne({ "User.Personal_info.Email": req.user.email });

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found in the database" });
    }

    Chat.find({ users: { $elemMatch: { $eq: currentUser._id } } })
      .populate("users", "-User.Personal_info.Password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "User.Personal_info.Username User.Personal_info.Email User.Personal_info.profilePicture",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    console.error("Error fetching chats:", error.message);
    res.status(400).json({ message: error.message });
  }
});

const markChatAsRead = async (req, res) => {
  try {
      const { chatId } = req.params;
      
      const chat = await Chat.findOneAndUpdate(
          { _id: chatId },
          {
              $addToSet: { 
                  readBy: req.user._id 
              }
          },
          { new: true }
      )
      .populate("users", "-password")
      .populate("latestMessage");

      if (!chat) {
          return res.status(404).json({ message: "Chat not found" });
      }

      res.json(chat);
  } catch (error) {
      res.status(500).json({ message: "Error marking chat as read", error: error.message });
  }
};


module.exports = { accessChat, fetchChats, markChatAsRead};