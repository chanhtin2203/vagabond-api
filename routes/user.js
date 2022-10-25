const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userControllers");

const router = require("express").Router();

// Update user
router.put(
  "/edit/:id",
  middlewareController.verifyTokenAndAuthorization,
  userController.updateByUsers
);

router.put(
  "/update/:id",
  middlewareController.verifyTokenAndAuthAdmin,
  userController.updateUsersByAdmin
);

router.put(
  "/password/:id",
  middlewareController.verifyTokenAndAuthorization,
  userController.changePassword
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
  middlewareController.verifyTokenAndAuthorization,
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
