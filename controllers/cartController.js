const Cart = require("../models/Cart");

const cartController = {
  // Create new product
  createNewCart: async (req, res) => {
    const newCart = new Cart(req.body);
    try {
      const savedCart = await newCart.save();
      return res.status(200).json(savedCart);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Update Product
  updateCart: async (req, res) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedCart);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Delete
  deleteCart: async (req, res) => {
    try {
      await Cart.findByIdAndRemove(req.params.id);
      return res.status(200).json("Cart has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get product
  getCart: async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get all Cart
  getAllCart: async (req, res) => {
    try {
      const carts = await Cart.find();
      return res.status(200).json(carts);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = cartController;
