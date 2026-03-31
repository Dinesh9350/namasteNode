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
module.exports = userRouter;
