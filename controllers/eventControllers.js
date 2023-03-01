const Event = require("../models/Event");
const User = require("../models/User");
const Pusher = require("pusher");

// package for running work periodically! eg hourly
const cron = require("node-cron");

const pusher = new Pusher({
  appId: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true,
});

// pusher beams
const PushNotifications = require("@pusher/push-notifications-server");

let beamsClient = new PushNotifications({
  instanceId: process.env.INSTANCE_ID,
  secretKey: process.env.INSTANCE_KEY,
});

const createEvent = async (req, res) => {
  req.body.user = req.user.userId;
  const currentUser = await User.findById(req.user.userId);
  const event = await Event.create(req.body);
  await pusher.trigger(req.user.userId, "event", "New item");
  await pusher.trigger(currentUser?.coparent.toString(), "event", "New item");
  res.status(200).json(event);
};

const getEvents = async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const events = await Event.find({
    $or: [{ user: req.user.userId }, { user: currentUser?.coparent }],
  })
    .populate("user")
    .sort("-createdAt");
  res.status(200).json(events);
};
const updateEvent = async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updated);
};

cron.schedule("0 * * * *", () => {
  console.log("Checking events due for notification");
  checkEventsForNotification();
});
const checkEventsForNotification = async () => {
  const eightHoursInMillis = 8 * 60 * 60 * 1000;
  const now = new Date();

  const events = await Event.find({});
  for (const event of events) {
    if (
      !event.notified &&
      ((event.startDate - eightHoursInMillis <= now && now < event.startDate) ||
        (event.endDate - eightHoursInMillis <= now && now < event.endDate))
    ) {
      event.notified = true;
      await event.save();
      sendNotification(event);
    }
  }
};

const sendNotification = async (event) => {
  await beamsClient
    .publishToInterests([currentUser.coparent.toString()], {
      apns: {
        aps: {
          alert: {
            title: "Event update",
            body: `Less than 8 hours to the event : ${event.title}`,
          },
        },
      },
      fcm: {
        notification: {
          title: "Event update",
          body: `Less than 8 hours to the event : ${event.title}`,
        },
      },
      web: {
        notification: {
          title: "Event update",
          body: `Less than 8 hours to the event : ${event.title}`,
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

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
};
