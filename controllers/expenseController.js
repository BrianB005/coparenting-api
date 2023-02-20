const Expense = require("../models/Expense");
const User = require("../models/User");

const createExpense = async (req, res) => {
  req.body.user = req.user.userId;
  const expense = await Expense.create(req.body);

  res.status(200).json(expense);
};

const getExpenses = async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const expenses = await Expense.find({
    $or: [{ user: req.user.userId }, { user: currentUser?.coparent }],
  })
    .populate("user")
    .sort("-createdAt");
  res.status(200).json(expenses);
};

const updateExpense = async (req, res) => {
  const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updated);
};

const payPart = async (req, res) => {
  const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updated);
};

module.exports = {
  payPart,
  updateExpense,
  getExpenses,
  createExpense,
};
