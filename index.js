const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connect to mongodb");
});

app.use(cors());

app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/products", productRoute);
app.use("/v1/carts", cartRoute);
app.use("/v1/orders", orderRoute);

app.listen(8000, () => {
  console.log("server is running");
});
