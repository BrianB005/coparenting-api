const Message = require("../models/Message");
const Pusher = require("pusher");
const User = require("../models/User");

const pusher = new Pusher({
  appId: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true,
});
const PushNotifications = require("@pusher/push-notifications-server");

let beamsClient = new PushNotifications({
  instanceId: process.env.INSTANCE_ID,
  secretKey: process.env.INSTANCE_KEY,
});

const sendMessage = async (req, res) => {
  req.body.sender = req.user.userId;
  const currentUser = await User.findById(req.user.userId);
  req.body.recipient = currentUser?.coparent;
  await Message.create(req.body)
    .then((message) => {
      return Message.findById(message._id)
        .populate(["sender", "recipient"])
        .exec();
    })
    .then((message) => {
      pusher.trigger(message.sender._id.toString(), "message", { message });
      pusher.trigger(message.recipient._id.toString(), "message", { message });
      res.status(200).json(message);
    })
    .catch((error) => {
      console.error(error);
    });

  beamsClient
    .publishToInterests([currentUser.coparent.toString()], {
      apns: {
        aps: {
          alert: {
            title: "New message",
            body: `Your co just texted you`,
          },
        },
      },
      fcm: {
        notification: {
          title: "New message",
          body: `Your co just texted you`,
        },
      },
      web: {
        notification: {
          title: "New message",
          body: `Your co just texted you`,
        },
      },
    })
    .then((publishResponse) => {
      console.log("Just published:", publishResponse.publishId);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
