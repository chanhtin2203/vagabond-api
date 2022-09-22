const User = require("../models/User");
const CryptoJS = require("crypto-js");

const userController = {
  // Update
  updateUsers: async (req, res) => {
    if (req.body.admin) {
      return res.status(403).json("You're not change role admin");
    }
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Delete
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndRemove(req.params.id);
      return res.status(200).json("User has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get users
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      return res.status(200).json(others);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get all users
  getAllUser: async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find()
            .sort({
              _id: -1,
            })
            .limit(5)
        : await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get user stats
  getUserStats: async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = userController;
