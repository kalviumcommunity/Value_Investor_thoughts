const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    profilePic: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema, "user");

module.exports = userModel;
