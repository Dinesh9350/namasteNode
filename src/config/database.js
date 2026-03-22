const mongoose = require("mongoose");
//connect to cluster
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dinesh:ehSvIfGheAl4dxWR@cluster0.l8wsd6i.mongodb.net/DevTinder",
  );
};

module.exports = connectDB;
