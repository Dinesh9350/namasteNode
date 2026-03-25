const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    //Encryption of Password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("passwordHash: ", passwordHash);

    // creating a new instance of User modal
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    //user will be saved in DB
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //Create a JWT Token
      const token = await user.getJWT();
      console.log(token);

      //add Token to Cookie and send the response to ther User
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      res.status(200).send("Login Successfully!");
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(400).send("Login Failed:" + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Sucessfully!");
});

module.exports = authRouter;

