const Product = require("../models/Product");

const productController = {
  // Create new product
  createNewProduct: async (req, res) => {
    const newProduct = new Product(req.body);
    try {
      const savedProduct = await newProduct.save();
      return res.status(200).json(savedProduct);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Update Product
  updateProduct: async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Delete
  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndRemove(req.params.id);
      return res.status(200).json("Product has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get product
  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get all Product
  getAllProduct: async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let products;

      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        products = await Product.find();
      }

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = productController;
