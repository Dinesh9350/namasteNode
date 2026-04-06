const mongoose = require("mongoose");
//connect to cluster
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dinesh:ustV3f0aw042V3HJ@cluster0.l8wsd6i.mongodb.net/DevTinder",
  );
};

module.exports = connectDB;
