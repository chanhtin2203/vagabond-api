const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userControllers");

const router = require("express").Router();

// Update user
router.put(
  "/edit/:id",
  middlewareController.verifyTokenAndAuthorization,
  userController.updateUsers
);

// Delete user
router.delete(
  "/delete/:id",
  middlewareController.verifyTokenAndAuthAdmin,
  userController.deleteUser
);

//Get user
router.get(
  "/find/:id",
  middlewareController.verifyTokenAndAuthAdmin,
  userController.getUser
);

//Get All user
router.get(
  "/",
  middlewareController.verifyTokenAndAuthAdmin,
  userController.getAllUser
);

//Get user stats
router.get(
  "/stats",
  middlewareController.verifyTokenAndAuthAdmin,
  userController.getUserStats
);

module.exports = router;
