const Expense = require("../model/expense.model");
const { createError } = require("../utils/expense.util");
const mongoose = require("mongoose");

exports.createExpenseService = async (desc, amount, createdAt) => {
  try {
    const expense = await Expense.create({ desc, amount, createdAt });
    if (!expense) {
      throw createError(400, "Unable to create an expense");
    }
    return expense;
  } catch (error) {
    throw error;
  }
};

exports.getExpenseService = async () => {
  try {
    const expenses = await Expense.find();
    if (!expenses) {
      throw createError(404, "Unable to find expenses");
    }
    return expenses;
  } catch (error) {
    throw error;
  }
};

exports.getSingleExpenseService = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid expense ID format");
    }
    const expense = await Expense.findById(id);
    if (!expense) {
      throw createError(404, "Unable to find expense");
    }
    return expense;
  } catch (error) {
    throw error;
  }
};

exports.updateExpenseService = async (id, newdesc, newamount) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid expense ID format");
    }
    const expense = await Expense.findByIdAndUpdate(
      id,
      { desc: newdesc, amount: newamount },
      { new: true, runValidators: true }
    );
    if (!expense) {
      throw createError(404, "Unable to find expense");
    }
    return expense;
  } catch (error) {
    throw error;
  }
};

exports.deleteExpenseService = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid expense ID format");
    }
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      throw createError(404, "Unable to find expense");
    }
    return expense;
  } catch (error) {
    throw error;
  }
};

exports.summaryService = async () => {
  try {
    const summary = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          leastAmount: { $min: "$amount" },
          highestAmount: { $max: "$amount" },
          averageAmount: { $avg: "$amount" },
        },
      },
    ]);
    return summary;
  } catch (error) {
    throw error;
  }
};

exports.monthlySummaryService = async (year, month) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-${month}-01`),
            $lte: new Date(`${year}-${month}-31`),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          leastAmount: { $min: "$amount" },
          highestAmount: { $max: "$amount" },
          averageAmount: { $avg: "$amount" },
        },
      },
    ]);
    return summary;
  } catch (error) {
    throw error;
  }
};
