const Message = require("../models/Message");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true,
});
const sendMessage = async (req, res) => {
  req.body.sender = req.user.userId;
  const message = await Message.create(req.body);
  pusher.trigger(message.sender.toString(), "message", { message });
  pusher.trigger(message.recipient.toString(), "message", { message });
};
const getSingleChat = async (req, res) => {
  const chatMessages = await Message.find({
    $or: [
      {
        $and: [
          { recipient: req.params.recipient },
          { sender: req.user.userId },
        ],
      },
      {
        $and: [
          { recipient: req.user.userId },
          { sender: req.params.recipient },
        ],
      },
      // {},
    ],
  }).sort("createdAt");

  res.status(200).json(chatMessages);
};
module.exports = { sendMessage, getSingleChat };
