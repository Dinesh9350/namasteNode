const express = require("express");
const { AdminAuth } = require("./middlewares/auth.js");
const connectDB = require("./config/database.js");

const app = express();

const User = require("../src/models/user.js");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Dinesh",
    lastName: "Singh",
    email: "ds3396312@gmail.com",
    password: "password@123",
  };
  // creating a new instance of User modal
  const user = new User(userObj);
  //user will be saved in DB
  try {
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB connection established!");
    app.listen(4000, () => {
      console.log("server is runnning");
    });
  })
  .catch((err) => {
    console.error("DB connected be connected!");
  });
