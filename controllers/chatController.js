const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const chatController = {
  getAllConversation: async (req, res) => {
    const allConversation = await Conversation.find().sort({
      _id: -1,
    });
    res.send(allConversation);
  },
  getMessageByConversation: (req, res) => {
    Conversation.findOne({
      $or: [{ idUser: req.query.idUser }, { _id: req.query.idConversation }],
    }).then((user) => {
      if (!user)
        return res.status(200).json({
          messageList: [],
        });

      Message.find({
        idConversation: user._id,
      }).exec((err, messages) => {
        if (!messages) {
          return res.status(400).json({
            message: "Thất bại",
          });
        }
        return res.status(200).json({
          messageList: messages,
        });
      });
    });
  },
  postSaveMessage: async (req, res) => {
    const messageText = new Message({
      sender: req.body.sender,
      message: req.body.message,
      idConversation: req.body.idConversation,
    });
    const createMessage = await messageText.save();
    res.send(createMessage);
  },
};

module.exports = chatController;
