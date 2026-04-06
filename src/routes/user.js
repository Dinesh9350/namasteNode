const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//request recieved by user
userRouter.get("/user/requests/reveieved", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const receievedId = req.params.receievedId;
    const incomingConnectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.send({
      message: "Data fetch successfully!",
      data: incomingConnectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

//request accepted by user
//accepted status, it can either be the sender or receiever
userRouter.get("/user/connections", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((conn) => {
      if (conn.fromUserId.equals(loggedInUser._id)) {
        return conn.toUserId;
      }
      return conn.fromUserId;
    });

    res.send({
      message: "Data fetch successfully!",
      data: data,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

//feed

// User should see all the cards except
// 1. his own card
// 2. his connections
// 3. ignored people
// 4. already sent the connection express.request

// or

//my version
//1. do now show my profile in feed
//2. do not show profile whom i already sent request of interested and ignored
//3. do not show profile whom i already accepted (have connection) and rejected

userRouter.get("/user/feed", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    //to send a max of 50 user
    limit = limit > 50 ? 50 : limit;
    console.log("limit: ", limit);

    const skip = (page - 1) * limit;

    //finds all connection requests (sent + receieved)
    //select - to filter or send specific data
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //user who sent or receive req from/to me
    //new Set only store unique values
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((conn) => {
      hideUsersFromFeed.add(conn.fromUserId.toString());
      hideUsersFromFeed.add(conn.toUserId.toString());
    });

    console.log("hideUsersFromFeed: ", hideUsersFromFeed);
    const users = await User.find({
      //$nin - not in array (id should not be present in Array from hideUsersFromFeed)
      //$ne - not equal to
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json("Error: " + error.message);
  }
});
module.exports = userRouter;
