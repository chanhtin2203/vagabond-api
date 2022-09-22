const middlewareController = require("../controllers/middlewareController");
const orderController = require("../controllers/orderController");
const router = require("express").Router();

// Create
router.post(
  "/",
  middlewareController.verifyToken,
  orderController.createNewOrder
);

// Update
router.put(
  "/edit/:id",
  middlewareController.verifyTokenAndAuthAdmin,
  orderController.updateOrder
);

// Delete
router.delete(
  "/delete/:id",
  middlewareController.verifyTokenAndAuthAdmin,
  orderController.deleteOrder
);

// get user orders
router.get(
  "/find/:userId",
  middlewareController.verifyTokenAndAuthorization,
  orderController.getOrder
);

// get all cart
router.get(
  "/",
  middlewareController.verifyTokenAndAuthAdmin,
  orderController.getAllOrder
);

// Get Monthly income
router.get(
  "/income",
  middlewareController.verifyTokenAndAuthAdmin,
  orderController.getMonthlyIncome
);

module.exports = router;
