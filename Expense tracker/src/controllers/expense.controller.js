const logger = require("../config/logger.config");
const {
  createExpenseService,
  getExpenseService,
  getSingleExpenseService,
  updateExpenseService,
  deleteExpenseService,
  summaryService,
  monthlySummaryService,
} = require("../services/expense.service");

exports.createExpense = async (req, res, next) => {
  try {
    const { desc, amount, createdAt } = req.body;

    logger.info("Creating new expense", {
      desc,
      amount,
      createdAt,
      userId: req.user.id,
    });

    const result = await createExpenseService(desc, amount, createdAt);

    logger.info("Expense created successfully", {
      expenseId: result._id,
      userId: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    logger.error("Error creating expense", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body,
    });
    next(error);
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    logger.info("Fetching all expenses", {
      userId: req.user.id,
      query: req.query,
    });

    const result = await getExpenseService();

    logger.info("Expenses fetched successfully", {
      count: result.length,
      userId: req.user.id,
    });

    res.status(200).json({
      status: "success",
      length: result.length,
      data: result,
    });
  } catch (error) {
    logger.error("Error fetching expenses", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });
    next(error);
  }
};

exports.getSingleExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info("Fetching single expense", {
      expenseId: id,
      userId: req.user.id,
    });

    const result = await getSingleExpenseService(id);

    logger.info("Single expense fetched successfully", {
      expenseId: id,
      userId: req.user.id,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    logger.error("Error fetching single expense", {
      error: error.message,
      stack: error.stack,
      expenseId: req.params.id,
      userId: req.user?.id,
    });
    next(error);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { desc, amount } = req.body;

    logger.info("Updating expense", {
      expenseId: id,
      updates: { desc, amount },
      userId: req.user.id,
    });

    const result = await updateExpenseService(id, desc, amount);

    logger.info("Expense updated successfully", {
      expenseId: id,
      userId: req.user.id,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    logger.error("Error updating expense", {
      error: error.message,
      stack: error.stack,
      expenseId: req.params.id,
      userId: req.user?.id,
      body: req.body,
    });
    next(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info("Deleting expense", {
      expenseId: id,
      userId: req.user.id,
    });

    await deleteExpenseService(id);

    logger.info("Expense deleted successfully", {
      expenseId: id,
      userId: req.user.id,
    });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    logger.error("Error deleting expense", {
      error: error.message,
      stack: error.stack,
      expenseId: req.params.id,
      userId: req.user?.id,
    });
    next(error);
  }
};

exports.summary = async (req, res, next) => {
  try {
    logger.info("Fetching expense summary", {
      userId: req.user.id,
    });

    const result = await summaryService();

    logger.info("Summary fetched successfully", {
      userId: req.user.id,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    logger.error("Error fetching summary", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });
    next(error);
  }
};

exports.monthlySummary = async (req, res, next) => {
  try {
    const { year, month } = req.params;

    logger.info("Fetching monthly summary", {
      year,
      month,
      userId: req.user.id,
    });

    const result = await monthlySummaryService(year, month);

    logger.info("Monthly summary fetched successfully", {
      year,
      month,
      userId: req.user.id,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    logger.error("Error fetching monthly summary", {
      error: error.message,
      stack: error.stack,
      year: req.params.year,
      month: req.params.month,
      userId: req.user?.id,
    });
    next(error);
  }
};
