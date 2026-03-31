const express = require("express");
const User = require("../models/user");
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const requestRouter = express.Router();

//  POST /request/send/:status/:userId

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

requestRouter.post(
  "/request/review/:status/:requestId",
  UserAuth,
  async (req, res) => {
    try {
      //sending a connection request
      const loggedInUser = req.user;
      const loggedInUserId = req.user._id;
      const status = req.params.status;
      const requestId = req.params.requestId;

      console.log("status", status);

      const allowedStatuses = ["accepted", "rejected"];
      //loggedInUser === toUserId
      //status = interested

      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid Status type: " + status);
      }

      const fromUser = await User.findById(requestId);
      if (!loggedInUser) {
        throw new Error("toUser not found");
      }
      if (!fromUser) {
        throw new Error("fromUserId not found");
      }

      console.log("requestId", requestId);
      console.log("loggedInUser._id", loggedInUser._id);

      //check if there is any existing connection request
      const interestedConnectionRequest = await ConnectionRequestModel.findOne({
        fromUserId: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      console.log("interestedConnectionRequest: ", interestedConnectionRequest);

      if (!interestedConnectionRequest) {
        throw new Error("Connection Request Not Found!");
      }

      interestedConnectionRequest.status = status;
      const data = await interestedConnectionRequest.save();

      res.json({
        message: `${loggedInUser.firstName} ${loggedInUser.lastName} ${status} ${fromUser.firstName} ${fromUser.lastName}`,
        data: data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  },
);

module.exports = requestRouter;
