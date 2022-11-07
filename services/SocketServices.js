const Comments = require("../models/Comment");
const SocketServices = {
  //connection socket
  connection(socket) {
    let users = [];
    socket.on("disconnect", () => {
      users = users.filter((user) => user.userId !== socket.id);
      console.log(`User disconnect id is ${socket.id}`);
    });

    socket.on("joinRoom", (id) => {
      const user = { userId: socket.id, room: id };

      const check = users.every((user) => user.userId !== socket.id);
      if (check) {
        users.push(user);
        socket.join(user.room);
      } else {
        users.map((user) => {
          if (user.userId === socket.id) {
            if (user.room !== id) {
              socket.leave(user.room);
              socket.join(id);
              user.room = id;
            }
          }
        });
      }
    });

    socket.on("createComment", async (msg) => {
      const { username, content, product_id, createdAt, send } = msg;

      const newComment = new Comments({
        username,
        content,
        product_id,
        createdAt,
      });

      if (send === "replyComment") {
        const { _id, username, content, product_id, createdAt } = newComment;
        const comment = await Comments.findById(product_id);
        if (comment) {
          comment.reply.push({ _id, username, content, createdAt });

          await comment.save();
          _io.to(comment.product_id).emit("sendReplyCommentToClient", comment);
        }
      } else {
        await newComment.save();
        _io.to(newComment.product_id).emit("sendCommentToClient", newComment);
      }
    });
  },
};

module.exports = SocketServices;
