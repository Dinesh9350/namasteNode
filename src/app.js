const express = require("express");
const cors = require("cors");
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
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
