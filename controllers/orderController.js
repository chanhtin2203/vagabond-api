const Order = require("../models/Order");
const dateFormat = require("dateformat");

const orderController = {
  // Create new product
  createNewOrder: async (req, res) => {
    const date = new Date();
    const payDate = dateFormat(date, "yyyy-mm-dd HH:mm:ss");
    const newOrder = new Order({ ...req.body, payDate: payDate });
    try {
      const savedOrder = await newOrder.save();
      return res.status(200).json(savedOrder);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Update Product
  updateOrder: async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Delete
  deleteOrder: async (req, res) => {
    try {
      await Order.findByIdAndRemove(req.params.id);
      return res.status(200).json("Order has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get User Orders
  getOrder: async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.params.id });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get all Cart
  getAllOrder: async (req, res) => {
    try {
      const orders = await Order.find();
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get Monthly income
  getMonthlyIncome: async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1)
    );

    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      return res.status(200).json(income);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = orderController;
