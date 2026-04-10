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
const http = require("http");
const { UserAuth } = require("./middlewares/auth.js");
require("dotenv").config();
require("./utils/cronjob.js");

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
const chatRouter = require("./routes/chat.js");
const initializeSocket = require("./utils/socket.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("DB connection established!");
    server.listen(4000, () => {
      console.log("server is runnning at PORT " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("DB cannot be connected! " + err.message);
  });
