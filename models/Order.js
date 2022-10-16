const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        size: {
          type: String,
        },
      },
    ],
    amount: { type: Number, required: true },
    note: { type: String },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    payment: { type: Boolean, required: true, default: false },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
