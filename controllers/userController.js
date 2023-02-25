const User = require("../models/User");

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

const getCurrentUser = async (req, res) => {
  const currentUser = await User.findById(req.user.userId).populate("coparent");
  res.status(200).json(currentUser);
};

const addChildren = async (req, res) => {
  const user = await User.findById(req.user.userId);
};

module.exports = { getCurrentUser, getUsers };
