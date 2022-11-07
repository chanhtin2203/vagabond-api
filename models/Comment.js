const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    content: {
      type: String,
    },
    product_id: {
      type: String,
    },
    reply: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentSchema);
