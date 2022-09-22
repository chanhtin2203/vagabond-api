const middlewareController = require("../controllers/middlewareController");
const cartController = require("../controllers/cartController");
const router = require("express").Router();

// Create
router.post(
  "/",
  middlewareController.verifyToken,
  cartController.createNewCart
);

// Update
router.put(
  "/edit/:id",
  middlewareController.verifyTokenAndAuthorization,
  cartController.updateCart
);

// Delete
router.delete(
  "/delete/:id",
  middlewareController.verifyTokenAndAuthorization,
  cartController.deleteCart
);

// get cart
router.get(
  "/find/:userId",
  middlewareController.verifyTokenAndAuthorization,
  cartController.getCart
);

// get all cart
router.get(
  "/",
  middlewareController.verifyTokenAndAuthAdmin,
  cartController.getAllCart
);

module.exports = router;
