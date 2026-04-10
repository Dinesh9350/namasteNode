const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateProfileEditData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    // console.log("user", user);

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit request");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);

    //old way :-
    // const UpdatedUser = await User.findByIdAndUpdate(
    //   loggedInUser._id,
    //   req.body,
    //   {
    //     returnDocument: "after",
    //     runValidators: true,
    //   },
    // );

    //forEach - ilterates array, returns undefined
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} ${loggedInUser.lastName} profile Updated Successfully!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json("Error: " + error.message);
  }
});

module.exports = profileRouter;
