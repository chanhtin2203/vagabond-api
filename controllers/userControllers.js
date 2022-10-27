const User = require("../models/User");
const Order = require("../models/Order");
const CryptoJS = require("crypto-js");

const userController = {
  // Update
  updateByUsers: async (req, res) => {
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
      const { password, ...orthers } = updatedUser._doc;
      return res.status(200).json(orthers);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateUsersByAdmin: async (req, res) => {
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
      const { password, ...orthers } = updatedUser._doc;
      return res.status(200).json(orthers);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  changePassword: async (req, res) => {
    try {
      if (req.body.oldPassword) {
        const user = await User.findOne({ _id: req.params.id });
        const hashedPassword = await CryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC
        );
        const validPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (validPassword !== req.body.oldPassword) {
          return res.status(200).json({ message: "Wrong password" });
        }

        req.body.password = CryptoJS.AES.encrypt(
          req.body.password,
          process.env.PASS_SEC
        ).toString();

        if (user && validPassword) {
          const newPassword = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          const { password, ...orthers } = newPassword._doc;
          res.status(200).json(orthers);
        }
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // Delete
  deleteUser: async (req, res) => {
    try {
      const userDelete = await User.findByIdAndRemove(req.params.id);
      return res.status(200).json(userDelete);
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
    const qSearch = req.query.search;

    try {
      let users;
      if (qSearch) {
        users = await User.find({
          $text: { $search: `\"${qSearch}\"` },
        });
      } else if (query) {
        users = await User.find()
          .sort({
            _id: -1,
          })
          .limit(5);
      } else {
        users = await User.find();
      }

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
