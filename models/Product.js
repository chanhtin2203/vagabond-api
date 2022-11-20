const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    cloudinary_id: {
      type: String,
    },
    category: {
      type: String,
      require: true,
    },
    subCategory: {
      type: String,
      require: true,
    },
    size: {
      type: Array,
    },
    price: {
      type: Number,
      require: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ title: "text" });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });

module.exports = mongoose.model("Product", productSchema);
