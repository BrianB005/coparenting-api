const Gallery = require("../models/Gallery");
const cloudinary = require("../services/cloudinary");
const CustomError = require("../errors");
const User = require("../models/User");

const addImages = async (req, res) => {
  req.body.user = req.user.userId;
  await Gallery.create(req.body);
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
