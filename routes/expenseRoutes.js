const { Router } = require("express");
const {
  createExpense,
  getExpenses,
  updateExpense,
  payPart,
} = require("../controllers/expenseController");
const { authenticateUser } = require("../middleware/authentication");
const router = Router();

router
  .route("/")
  .post(authenticateUser, createExpense)
  .get(authenticateUser, getExpenses);
router.route("/:id").put(authenticateUser, updateExpense);
router.route("/pay/:id").put(authenticateUser, payPart);

module.exports = router;
