const Comments = require("../models/Comment");
const Conversation = require("../models/Conversation");
const SocketServices = {
  //connection socket
  connection(socket) {
    let users = [];
    socket.on("disconnect", () => {
      users = users.filter((user) => user.userId !== socket.id);
      console.log(`User disconnect id is ${socket.id}`);
    });
    // Comments
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
    //////////////////////////////////////////////////////////////////////////////

    socket.on("join_conversation", (idUser) => {
      Conversation.findOne({ idUser }).then((conversation) => {
        if (!conversation) return;

        const idConversation = String(conversation._id);
        socket.join(idConversation);
      });
    });

    //admin join conversation
    socket.on("admin_join_conversation", (idConversation) => {
      // const conversation = await Conversation.findByIdAndUpdate({
      //   _id: idConversation
      // }
      // ,{
      //   seen: true
      // })

      socket.join(idConversation);
    });

    // create and join room
    socket.on("create_conversation", (currentUser) => {
      const conversation = new Conversation({
        idUser: currentUser._id,
        nameConversation: currentUser.name,
      });

      conversation.save().then((data) => {
        socket.join(String(data._id));
        socket.emit("response_room", data);
      });
    });

    // chat
    socket.on("chat", async (data) => {
      const { _id, sender, message, idConversation } = data;
      

      const conversation = await Conversation.updateOne(
        {
          _id: idConversation,
        },
        {
          lastMessage: message,
        }
        // {new: true}
      );
      _io.emit("lastMessage", conversation);

      const payload = {
        idConversation,
        sender,
        message,
        _id,
      };

      _io.to(idConversation).emit("newMessage", payload);

      const conver = await Conversation.findOne({ _id: idConversation });
      _io.emit("show-me", conver);
    });
  },
};

module.exports = SocketServices;
