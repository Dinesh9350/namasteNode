## Episode-12 - Logical DB Query & Compound Indexes
important

Connection Request Api's :-

## connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

statuses: ignored, interested, accepted, rejected

For making a connection btw two users, we are creating ConnectionSchema

```js
//models/connectionRequest.js
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    //type for mongo id
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    //enum: same do in user Gender types
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect status type`,
    },
  },
});

const connectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);

module.exports = connectionRequestModel;
```

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

POST /request/send/interested/:userId
POST /request/send/ignored/:userId

```js
//routes/request.js
const express = require("express");
const User = require("../models/user");
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const requestRouter = express.Router();

// - POST /request/send/:status/:userId
// - POST /request/review/:status/:requestId

requestRouter.post(
  "/request/send/:status/:userId",
  UserAuth,
  async (req, res) => {
    try {
      //sending a connection request
      const fromUserId = req.user;
      const toUserId = req.params.userId;
      const status = req.params.status;

      //Validation - status: user can send anything interested, rejected, accepted reject but we should be only able to send interested, rejected only
      const allowedStatuses = ["interested", "rejected"];

      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid Status type: " + status });
      }

      const toUser = await User.findById(toUserId);

      const connectionRequest = new ConnectionRequestModel({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `${fromUserId.firstName} ${fromUserId.lastName} sent Connection Request to ${toUser.firstName} ${toUser.lastName}`,
        data: data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  },
);

module.exports = requestRouter;
```

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

Dinesh sent connection request to Elon but now,
Dinesh should not be able to sent connection req again to the Elon
Elon should not be able to send req to Dinesh

# check if there is any existing connection request

```js
//here we are handling that Dinesh wouldn't be able to send Connection Request again to ELon and Elon wouldn't be able to send connection request to Dinesh
const exisitingConnectionRequest = await ConnectionRequestModel.findOne({
  $or: [
    { fromUserId, toUserId },
    { fromUserId: toUserId, toUserId: fromUserId },
  ],
});
```

```js
//I shouldn't be able to send Connection Request to myself
const exisitingConnectionRequest = await ConnectionRequestModel.findOne({
  $or: [
    { fromUserId, toUserId },
    { fromUserId: toUserId, toUserId: fromUserId },
  ],
});
```

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Sending Connection Requset to Yourself

//sending connection request to myself Schema -> middleware
//connectionRequestSchema.save(), it'll be callled before this save

```js
//models/connectionRequest.js
connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  //check if fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send Connection Request to Yourself!");
  }
});
```

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Index

//As the users of the app will increase to 10,00,000 my queries will becomes expensive,
//for this we need Indexes in our DB : it makes our db faster
//why we need Indexes ?
//Suppose we have many user having Name Virat Singh, Kohli etc, and i'm trying to find using the FirstName and There are 10,000 people having the Name starting from "Virat". So my DB will take a lot of time
//For ex: User.find(), it'll go and search each user firstName having Virat, if we have index it'll be faster
//index: true
//if unique: true -> mongodb automatically creates index

//compound index

```js
//models/connectionRequest.js
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
```

//Read more about index in mongodb
Advantages or disadvantages of using index


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//Final code

```js
//routes/request.js
const express = require("express");
const User = require("../models/user");
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const requestRouter = express.Router();
// - POST /request/send/:status/:userId
// - POST /request/review/:status/:requestId
requestRouter.post(
  "/request/send/:status/:userId",
  UserAuth,
  async (req, res) => {
    try {
      //sending a connection request
      const fromUser = req.user;
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      console.log("fromUserId", fromUserId);
      console.log("toUserId", toUserId);

      const allowedStatuses = ["interested", "ignored"];

      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid Status type: " + status);
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("toUser not found");
      }
      if (!fromUser) {
        throw new Error("fromUser not found");
      }

      //check if there is any existing connection request
      const exisitingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (exisitingConnectionRequest) {
        throw new Error("Connection Request Already Exisits!");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `${fromUser.firstName} ${fromUser.lastName}${status === "interested" ? " is " : ""} ${status} ${status === "interested" ? " in " : ""}${toUser.firstName} ${toUser.lastName}`,
        data: data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  },
);

module.exports = requestRouter;
```

```js
//models/connectionRequest.js
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//sending connection request to myself    Schema -> middleware
//connectionRequestSchema.save(), it'll be callled before this save
connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  //check if fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send Connection Request to Yourself!");
  }
});
```


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

H.W
logical mongodb queries: 
https://www.mongodb.com/docs/manual/reference/mql/query-predicates/logical/

Always think about corner cases
