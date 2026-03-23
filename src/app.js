const express = require("express");
const { AdminAuth } = require("./middlewares/auth.js");
const connectDB = require("./config/database.js");

const app = express();

const User = require("../src/models/user.js");
const { Model } = require("mongoose");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // creating a new instance of User modal
  const user = new User(req.body);
  //user will be saved in DB
  try {
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

//find user by email
app.get("/user", async (req, res) => {
  console.log(req.body.email);
  const email = req.body.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).send("User not found!");
    }
    res.send(user);
  } catch (error) {
    console.log("Error finding user: ", error.message);
  }
});

//delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    if (!user) {
      res.status(404).send("No user found!");
    }
    res.send("Deleted User :" + user);
  } catch (error) {
    res.status(400).send("user id is not provided :" + error.message);
  }
});

//update a user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "about", "skills"];

    const isAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    console.log(isAllowed);

    if (!isAllowed) {
      console.log("data: ", data);

      res.status(400).send("Update not Allowed!");
    }

    const user = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      data,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    console.log(user);
    if (!user) {
      res.status(404).send("No user found!");
    }
    res.send("User Updated Successfully :" + user);
  } catch (error) {
    res.status(400).send("User Update Failed! :" + error.message);
  }
});

//get all users from DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong: ", error.message);
  }
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
