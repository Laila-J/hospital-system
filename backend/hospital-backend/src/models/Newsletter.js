const mongoose = require("mongoose");

/**
 * Matches the single-field newsletter form in Home.jsx.
 */
const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Invalid email address."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
