const User = require("../models/user");
const jwt = require("jsonwebtoken");

const UserAuth = async (req, res, next) => {
  try {
    //Read the token from request cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login...");
    }
    //Validate the token
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMessage;

    //Find the User
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Authentication Failed: " + err.message);
  }
};

module.exports = { UserAuth };
