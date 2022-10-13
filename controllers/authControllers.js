const User = require("../models/User");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    try {
      //   Create new user
      const username = await User.findOne({ username: req.body.username });
      const email = await User.findOne({ email: req.body.email });
      if (username) return res.status(401).json({ message: "username taken" });
      if (email) return res.status(401).json({ message: "email taken" });

      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.PASS_SEC
        ).toString(),
      });
      //   Save to db
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // GENERATE ACESSTOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );
  },
  // GENERATE REFRESHTOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "365d" }
    );
  },
  // Login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return res.status(401).json({ message: "Incorrect username" });

      const hashedPassword = await CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );
      const validPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      if (validPassword !== req.body.password) {
        return res.status(401).json({ message: "Wrong password" });
      }

      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshTokenUser = authController.generateRefreshToken(user);

        res.cookie("refreshToken", refreshTokenUser, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // refresh token
  requestRefreshToken: async (req, res) => {
    // Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
      }
      //create new access token, refresh token and send to user
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
      });
    });
  },

  // LOGOUT
  userLogout: async (req, res) => {
    //Clear cookies when user logs out
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out successfully!");
  },
};

module.exports = authController;
