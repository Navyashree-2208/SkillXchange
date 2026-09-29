const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile"
    }],
    meetings:[{
      meetingID:{
        type:String
      },
      meetingUrl:{
        type:String
      },
      meetingTopic:{
        type:String
      },
      meetingStartTime:{
        type:String
      },
      meetingEndTime:{
        type:String
      }
    },
  ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;