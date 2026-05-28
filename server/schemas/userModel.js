const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    type: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isdoctor: {
      type: Boolean,
      default: false,
    },
    notification: {
      type: Array,
      default: [],
    },
    seennotification: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const userSchema = mongoose.model("user", userModel);
module.exports = userSchema;