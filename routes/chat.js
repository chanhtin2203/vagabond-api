const chatController = require("../controllers/chatController");
const middlewareController = require("../controllers/middlewareController");
const router = require("express").Router();

router.get(
  "/",
  middlewareController.verifyTokenAndAuthAdmin,
  chatController.getAllConversation
);

router.get(
  "/message",
  middlewareController.verifyTokenAndAuthorization,
  chatController.getMessageByConversation
);

router.post(
  "/save",
  middlewareController.verifyTokenAndAuthorization,
  chatController.postSaveMessage
);

module.exports = router;
