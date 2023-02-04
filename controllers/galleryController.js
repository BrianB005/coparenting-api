const Gallery = require("../models/Gallery");
const cloudinary = require("../services/cloudinary");
const CustomError = require("../errors");
const User = require("../models/User");

const addImages = async (req, res) => {
  const images = req.body.images;
  let images1 = [];
  if (images.length === 1) {
    const result = await cloudinary.uploader.upload(images[0].image, {
      folder: "Memories",
    });
    const image = { public_id: result.public_id, url: result.secure_url };
    req.body.images = [image];
    req.body.user = req.user.userId;
    await Gallery.create(req.body);
  } else {
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image?.image, {
        folder: "Memories",
      });
      const savedImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      images1.push(savedImage);
    }
    req.body.images = images1;
    req.body.user = req.user.userId;
    await Gallery.create(req.body);
  }
  res.status(200).json("Images saved to gallery successfully");
};

const getImages = async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const images = await Gallery.find(
    $or[({ user: req.user.user }, { user: currentUser?.coparent })]
  ).sort("-createdAt");
  res.status(200).json(images);
};

module.exports = {
  addImages,
  getImages,
};
