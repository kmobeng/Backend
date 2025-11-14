const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  desc: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;
