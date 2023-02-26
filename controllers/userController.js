const User = require("../models/User");
const CustomError = require("../errors");
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

const getCurrentUser = async (req, res) => {
  const currentUser = await User.findById(req.user.userId).populate("coparent");
  res.status(200).json(currentUser);
};
const addCoparent = async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const coparent = await User.findById(req.params.userId);
  if (!coparent) {
    throw new CustomError.BadRequestError(
      "Wrong code provided! Make sure that you copied the code correctly! You can also request it anew from your co"
    );
  } else {
    await currentUser.updateOne({ coparent: req.params.userId });
    await coparent.updateOne({ coparent: req.user.userId });
    await currentUser.save();
    await coparent.save();
    res.status(200).json("Coparent added successfully");
  }
};

module.exports = { getCurrentUser, getUsers, addCoparent };
