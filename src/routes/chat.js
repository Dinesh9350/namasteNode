const express = require("express");
const mongoose = require("mongoose");
const Chat = require("../models/chat");
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", UserAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID required" });
    }

    //if the from and two user are friend
    let isConnectionAccepted = await ConnectionRequestModel.findOne(
      {
        fromUserId: userId,
        toUserId: targetUserId,
        status: "accepted",
      },
      {
        fromUserId: targetUserId,
        toUserId: userId,
        status: "accepted",
      },
    );

    if (!isConnectionAccepted) {
      return res.status(400).send({ message: "Connection is not your friend" });
    }

    let chat = await Chat.findOne({
      participants: {
        $all: [
          new mongoose.Types.ObjectId(userId),
          new mongoose.Types.ObjectId(targetUserId),
        ],
      },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [userId, targetUserId],
        messages: [],
      });
    }

    res.json({
      success: true,
      messages: chat.messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = chatRouter;
