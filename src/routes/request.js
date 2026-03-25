const express = require("express");
const User = require("../models/user");
const { UserAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

// - POST /request/send/:status/:userId
// - POST /request/review/:status/:requestId

requestRouter.post(
  "/request/send/interested/:userId",
  UserAuth,
  async (req, res) => {
    //sending a connection request
    const user = req.user;
    const toUserId = req.params.userId;

    const toUser = await User.findById(toUserId);

    res.send(
      `${user.firstName} ${user.lastName} sent Connection Request to ${toUser.firstName} ${toUser.lastName}`,
    );
  },
);

module.exports = requestRouter;
