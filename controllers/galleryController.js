const Gallery = require("../models/Gallery");
const cloudinary = require("../services/cloudinary");
const CustomError = require("../errors");
const User = require("../models/User");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true,
});

const addImages = async (req, res) => {
  req.body.user = req.user.userId;
  const currentUser = await User.findById(req.user.userId);
  await Gallery.create(req.body);
  await pusher.trigger(req.user.userId, "gallery", "New item");
  await pusher.trigger(currentUser?.coparent.toString(), "gallery", "New item");

  res.status(200).json("Images saved to gallery successfully");
};

const getImages = async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const images = await Gallery.find({
    $or: [{ user: req.user.userId }, { user: currentUser?.coparent }],
  })
    .populate("user")
    .sort("-createdAt");
  res.status(200).json(images);
};

module.exports = {
  addImages,
  getImages,
};
