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
const stripeRoute = require("./routes/stripe");

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connect to mongodb");
});

app.use(
  cors({
    credentials: true,
    origin: (_, callback) => callback(null, true),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    optionsSuccessStatus: 200,
    // allowedHeaders: [
    //   "Access-Control-Allow-Headers",
    //   "Access-Control-Request-Headers",
    //   "Access-Control-Allow-Origin",
    //   "Access-Control-Allow-Methods",
    //   "Origin",
    //   "WithCredentials",
    //   "X-Requested-With",
    //   "Content-Type",
    //   "Accept",
    //   "Authorization",
    //   "X-HTTP-Method-Override",
    //   "Cookie",
    //   "Set-Cookie",
    //   "Request",
    // ],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

// ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/products", productRoute);
app.use("/v1/carts", cartRoute);
app.use("/v1/orders", orderRoute);
app.use("/v1/checkout", stripeRoute);

app.listen(8000, () => {
  console.log("server is running");
});
