const Comments = require("../models/Comment");

const commentsController = {
  getComments: async (req, res) => {
    try {
      const comments = await Comments.find({ product_id: req.params.id });
      
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = commentsController;
