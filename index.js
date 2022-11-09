const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const commentsRoute = require("./routes/comments");
const paymentRoute = require("./routes/payment");
const stripeRoute = require("./routes/stripe");
const chatRoute = require("./routes/chat");
const SocketServices = require("./services/SocketServices");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
dotenv.config();
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connect to mongodb");
});

app.use(
  cors({
    origin: "https://vagabond-kappa.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    optionsSuccessStatus: 200,
    // allowedHeaders: [
    //   "Access-Control-Allow-Headers",
    //   "Access-Control-Request-Headers",
    // "Access-Control-Allow-Origin",
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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
global._io = io;

global._io.on("connection", SocketServices.connection);

// ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/products", productRoute);
app.use("/v1/carts", cartRoute);
app.use("/v1/orders", orderRoute);
app.use("/v1", commentsRoute);
app.use("/v1/chat", chatRoute);
app.use("/v1/payment", paymentRoute);
app.use("/v1/checkout", stripeRoute);

const PORT = process.env.PORT || 8001;

http.listen(PORT, () => {
  console.log("server is running " + PORT);
});
