const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    age: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const modelUser = mongoose.model("User", userSchema);

module.exports = modelUser;
