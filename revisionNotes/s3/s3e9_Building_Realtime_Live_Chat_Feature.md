# Episode-09 - Building Real-time Live Chat Feature

we are getting message in both user but somewhere we need to store the chat

Backend

```js
// models/chat.js
const mongoose = require("mongoose");
const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamp: true },
);
const chatSchema = mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  message: [messageSchema],
});
module.exports = mongoose.model("Chat", chatSchema);
```

participants: [], this accepts multiple users, more than two it is more scalable that senderId: {} and recieverId: {}

next chat will be saved in db

I want my prev chat to show in ui for that i need to make an api call for fetching the chat

Backend

```js
// routes/chat.js
//also import in App.js
const express = require("express");
const Chat = require("../models/chat");
const { UserAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", UserAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: {
        $all: [userId, targetUserId],
      },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = await Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
      res.json(chat);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = chatRouter;
```

Frontend

```js
//Chat.js
const fetchChatMessages = async () => {
  try {
    const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
      withCredentials: true,
    });

    console.log(chat.data.messages);
    const chatMessages = chat?.data?.messages?.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text: msg?.text,
      };
    });
    setMessages(chatMessages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
  }
};
```

Now we have to show our chat on the right sider and who is sending to me in left
Right - logged in user
Left - Sender message

```js
//chat.js
  className={`chat ${user.firstName === msg?.firstName ? `chat-end` : `chat-start`} `}

```

import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(BASE_URL);
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};


to make it work on server

Home work:
Auth in Socket.io
If someone is not a friend, i should not be able to send message to that person
show Green symbol for online [last seen 2hrs ago also]
Limit messages while fetching from db, scroll more to show 20 more message
Project ideas: tic tak toe, chess
