const middlewareController = require("../controllers/middlewareController");
const orderController = require("../controllers/orderController");
const router = require("express").Router();

// Create
router.post(
  "/",
  middlewareController.verifyTokenAndAuthorization,
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
  "/find/:id",
  middlewareController.verifyTokenAndAuthorization,
  orderController.getOrder
);

// get all order
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
