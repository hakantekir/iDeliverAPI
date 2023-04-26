const { string } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    reset: {
      code: {
        type: String,
        trim: true,
        default: null,
      },
      time: {
        type: String,
        default: null,
      },
    },
  },
  { collection: "User", timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
