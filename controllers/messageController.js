const Message = require("../models/Message");
const Pusher = require("pusher");
const User = require("../models/User");
const cloudinary = require("../services/cloudinary");
const pusher = new Pusher({
  appId: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true,
});
const sendMessage = async (req, res) => {
  req.body.sender = req.user.userId;
  const currentUser = await User.findById(req.user.userId);
  req.body.recipient = currentUser?.coparent;
  if (req.body.image) {
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: "Messages",
    });
    const savedImage = {
      public_id: result.public_id,
      url: result.secure_url,
    };
    req.body.image = savedImage;
  }
  const message = await Message.create(req.body);
  pusher.trigger(message.sender.toString(), "message", { message });
  pusher.trigger(message.recipient.toString(), "message", { message });
  res.status(200).json(message);
};
const getSingleChat = async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const chatMessages = await Message.find({
    $or: [
      {
        $and: [
          { recipient: currentUser?.coparent },
          { sender: req.user.userId },
        ],
      },
      {
        $and: [
          { recipient: req.user.userId },
          { sender: currentUser?.coparent },
        ],
      },
      // {},
    ],
  })
    .populate(["sender", "recipient"])
    .sort("createdAt");

  res.status(200).json(chatMessages);
};
module.exports = { sendMessage, getSingleChat };
