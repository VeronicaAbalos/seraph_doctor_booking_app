const mongoose = require("mongoose");

const docModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    fees: {
      type: Number,
      required: [true, "Fees are required"],
    },
    timings: {
      type: Object,
      required: [true, "Work timings are required"],
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const docSchema = mongoose.model("doctor", docModel);
module.exports = docSchema;