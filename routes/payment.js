const middlewareController = require("../controllers/middlewareController");
const paymentController = require("../controllers/paymentController");
const router = require("express").Router();

router.post(
  "/create",
  middlewareController.verifyToken,
  paymentController.createPayment
);
router.get(
  "/vnpay_return",
  middlewareController.verifyToken,
  paymentController.returnPayment
);
router.get(
  "/vnpay_ipn",
  middlewareController.verifyToken,
  paymentController.inpPayment
);

module.exports = router;
