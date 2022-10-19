const OrderModel = require("../models/Order");
const querystring = require("qs");
const dateFormat = require("dateformat");
const crypto = require("crypto");
const expressAsyncHandler = require("express-async-handler");

const tmnCode = process.env.VNP_TMN_CODE;
const secretKey = process.env.VNP_HASH_SECRET;
const url = process.env.VNP_URL;
const returnUrl = process.env.VNP_RETURN_URL;

const paymentController = {
  createPayment: expressAsyncHandler(async (req, res) => {
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const order = new OrderModel({
      ...req.body,
    });

    order.save();

    let vnpUrl = url;
    const date = new Date();

    const createDate = dateFormat(date, "yyyymmddHHmmss");
    const orderId = order._id.toString();
    const amount = req.body.amount;
    // var orderId = dateFormat(date, 'HHmmss');

    var locale = "vn";
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;

    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Mua hàng thanh toán cho shop vagabond";
    vnp_Params["vnp_OrderType"] = "billpayment";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_BankCode"] = "NCB";

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });

    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });


    res.status(200).json({ code: "00", data: vnpUrl });
  }),
  returnPayment: expressAsyncHandler(async (req, res) => {
    try {
      let vnp_Params = req.query;
      const secureHash = vnp_Params.vnp_SecureHash;

      delete vnp_Params.vnp_SecureHash;
      delete vnp_Params.vnp_SecureHashType;

      vnp_Params = sortObject(vnp_Params);

      const signData = querystring.stringify(vnp_Params, { encode: false });

      const hmac = crypto.createHmac("sha512", secretKey);
      const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

      const id = vnp_Params.vnp_TxnRef;

      // res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
      if (secureHash === signed) {
        if (vnp_Params.vnp_ResponseCode == "00") {
          res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
        } else {
          const DeleteOrder = await OrderModel.findById({ _id: id });
          await DeleteOrder.remove();
          res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
        }
      } else {
        res.status(200).json({ code: "97" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }),
  inpPayment: async (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    const id = vnp_Params.vnp_TxnRef;

    if (secureHash === signed) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];

      const date = new Date();
      const payDate = dateFormat(date, "yyyy-mm-dd HH:mm:ss");

      await OrderModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            payment: true,
            bankCode: vnp_Params.vnp_BankCode,
            vnpCode: vnp_Params.vnp_TmnCode,
            payDate: payDate,
          },
        },
        { new: true }
      );
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  },
};

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = paymentController;
