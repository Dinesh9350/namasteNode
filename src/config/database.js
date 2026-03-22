const mongoose = require("mongoose");
//connect to cluster
const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
};

module.exports = connectDB;
