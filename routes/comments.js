const middlewareController = require("../controllers/middlewareController");
const commentControllers = require("../controllers/commentController");
const router = require("express").Router();

router.get("/comments/:id", commentControllers.getComments);

module.exports = router;
