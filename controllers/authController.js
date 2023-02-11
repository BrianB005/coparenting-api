const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { UserTokenPayload, createJWT } = require("../utils");

const register = async (req, res) => {
  const emailAlreadyExists = await User.findOne({ email: req.body.email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  req.body.role = role;
  const user = await User.create(req.body);
  const tokenUser = UserTokenPayload(user);
  const token = createJWT({ payload: tokenUser });
  res.status(StatusCodes.CREATED).json({ user, token: token });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Email doesn't exist");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Wrong password");
  }
  const tokenUser = UserTokenPayload(user);
  const token = createJWT({ payload: tokenUser });
  res.status(StatusCodes.CREATED).json({ user, token: token });
};
const logout = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = {
  register,
  login,
  logout,
};
