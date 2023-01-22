const mongoose = require("mongoose");
const ExpenseSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
  },
  expenseFor: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: [true, "You must provide  expense amount!"],
  },
  partner_has_paid: {
    type: Boolean,
  },
  partner_has_accepted: {
    type: Boolean,
  },
  i_have_paid:{
    type:Boolean,
    
  }
},{timestamps:true});

module.exports=mongoose.model("Expense",ExpenseSchema)
