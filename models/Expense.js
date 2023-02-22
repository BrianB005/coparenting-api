const mongoose = require("mongoose");
const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "You must provide  expense amount!"],
    },
    paid: {
      type: Array,
      default: [],
    },
    rejectionMessage: {
      type: String,
    },
    isAccepted: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
