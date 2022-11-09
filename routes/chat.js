const chatController = require("../controllers/chatController");
const middlewareController = require("../controllers/middlewareController");
const router = require("express").Router();

router.get("/", chatController.getAllConversation);

router.get("/message", chatController.getMessageByConversation);

router.post("/save", chatController.postSaveMessage);

module.exports = router;
