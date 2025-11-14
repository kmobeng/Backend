const { Router } = require("express");
const {
  createExpense,
  getExpense,
  getSingleExpense,
  updateExpense,
  deleteExpense,
  summary,
  monthlySummary,
} = require("../controllers/expense.controller");

const router = Router();

router.route("/").post(createExpense).get(getExpense);

router.route("/summary").get(summary);

router.route("/summary/:year/:month").get(monthlySummary);

router
  .route("/:id")
  .get(getSingleExpense)
  .patch(updateExpense)
  .delete(deleteExpense);

module.exports = router;
