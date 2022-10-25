const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
      maxlenght: 20,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      minlength: 10,
      maxlenght: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
    address: { type: String },
    phone: { type: String },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ fullname: "text" });
module.exports = mongoose.model("User", userSchema);
