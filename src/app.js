const express = require("express");
const { AdminAuth } = require("./middlewares/auth.js");
const connectDB = require("./config/database.js");

const app = express();

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
