# Episode-08 - Web Sockets & socket.io

go to socket.io intro

Socket.IO is a library that enables low-latency, bidirectional and event-based communication between a client and a server.

```js
//connection.js
<Link to={`/chat/${_id}`}>
  <button className="bg-green-500 text-white px-3 py-1 rounded-lg">Chat</button>
</Link>
```

```js
//chat.js
import React from "react";
import { useParams } from "react-router-dom";
const Chat = () => {
  const { targetUserId } = useParams();
  return <div>Chat {targetUserId}</div>;
};
export default Chat;
```

```js
//App.js
<Route path="/chat/:targetUserId" element={<Chat />} />
```

```js
//chat.js
//create chat from daisy ui and below input field and send button
```

# Backend

npm i socket.io
https://socket.io/docs/v4/server-api/

```js
//App.js
const http = require("http");
//above connectDB()
const server = http.createServer(app);
initializeSocket(server);
//change app.listen to server.listen
server.listen(4000, () => {});
```

```js
//utils/socket.js
const socket = require("socket.io");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    // handle events
    socket.on("joinChat", () => {});
    socket.on("sendMessage", () => {});
    socket.on("disconnect", () => {});
  });
};=
module.exports = initializeSocket;
```

# Frontend

npm i socket.io-client

```js
//utils/socket.js
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  return io(BASE_URL);
};
```

```js
//chat.js
useEffect(() => {
  const socket = createSocketConnection();
  //as soon as page loaded, the socket connection is made and joinChat event is emmited
  socket.emit("joinChat", { userId, targetUserId });
  return () => {
    socket.disconnect();
  };
}, []);
```

refresh app, in console it'll show socet.io

FrontEnd

```js
//chat.js
useEffect(() => {
  if (!userId) return;
  const socket = createSocketConnection();
  //as soon as page loaded, the socket connection is made and joinChat event is emmited
  socket.emit("joinChat", { firstName: user?.firstName, userId, targetUserId });
  return () => {
    socket.disconnect();
  };
}, [userId, targetUserId]);
```

Backend

```js
//socket.js
const socket = require("socket.io");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    // handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log("Joining Room: ", roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", () => {});
    socket.on("disconnect", () => {});
  });
};
module.exports = initializeSocket;
```

in backend console

<!-- Joining Room: 69ce1ce78764a7dedb31a69c_69c17c275a87184cf0591b26 -->

//open 2 windows for user who are connection to each other and check both joiining room should be same

Dinesh Joining Room: 69c25aab76c61a1f12f8b81c_69ce1ce78764a7dedb31a69c
NewUser Joining Room: 69ce1ce78764a7dedb31a69c_69c25aab76c61a1f12f8b81c

```js
//on send button click
const sendMessage = () => {
  const socket = createSocketConnection();
  socket.emit("sendMessage", {
    firstName: user?.firstName,
    userId,
    targetUserId,
    text: newMessage,
  });
};
```

Backend

```js
socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
  const roomId = [userId, targetUserId].sort().join("_");
  console.log(firstName + " " + text);
  io.to(roomId).emit("messageReceieved", { firstName, text });
});
```

Now first refresh each user and try to send message, it'll show in console
Dinesh hello world

but there is no ui to show Recieved message in the chat, to do that

Frontend

```js
//inside useEffect
socket.on("messageReceieved", ({ firstName, text }) => {
  console.log(firstName + ": ", text);
  setMessages((prev) => [...prev, { firstName, text }]);
});
```

Dinesh: hi new
NewUser: hi dinesh

make setNewMessageEmpty to remove prev message in input text

Backend
To make room id more secure:

```js
//socket.js
const roomId = getSecuretRoomId(userId, targetUserId);
const getSecuretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};
```

Dinesh Joining Room: d2e2adf7177b7a8afddbc12d1634cf23ea1a71020f6a1308070a16400fb68fde
NewUser Joining Room: d2e2adf7177b7a8afddbc12d1634cf23ea1a71020f6a1308070a16400fb68fde


https://socket.io/docs/v4/client-options/#auth

Currently, whatever we are sending recieving by both because of socket.io