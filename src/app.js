const express = require("express");
const { AdminAuth } = require("./middlewares/auth.js");
const connectDB = require("./config/database.js");
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const User = require("../src/models/user.js");
const { Model } = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { UserAuth } = require("./middlewares/auth.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("user", user);

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.post("/sendConnectionRequest/:toUserId", UserAuth, async (req, res) => {
  //sending a connection request
  const user = req.user;
  const toUserId = req.params.toUserId;

  const toUser = await User.findById(toUserId);

  res.send(
    user.firstName +
      " " +
      user.lastName +
      " sent Connection Request to " +
      toUser.firstName +
      " " +
      toUser.lastName,
  );
});

connectDB()
  .then(() => {
    console.log("DB connection established!");
    app.listen(4000, () => {
      console.log("server is runnning at PORT " + 4000);
    });
  })
  .catch((err) => {
    console.error("DB cannot be connected! " + err.message);
  });
