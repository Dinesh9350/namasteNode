const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address !");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please Enter a Strong Password!");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: `{VALUE} is incorrect Gender type`,
      },
      // validate(value) {
      //   if (!["male", "female"].includes(value)) {
      //     throw new Error("Gender is not valid!");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.vhv.rs/dpng/d/256-2569650_men-profile-icon-png-image-free-download-searchpng.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL!");
        }
      },
    },
    about: {
      type: String,
      default: "About Me",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  //Create a JWT Token
  const token = await jwt.sign({ _id: user._id }, "dev@Tinder$444", {
    expiresIn: "1d",
  });
  console.log("token: ", token);

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  console.log("isPasswordValid: ", isPasswordValid);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
