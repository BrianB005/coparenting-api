const express = require("express");
const { sendMail } = require("../controllers/mailController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();
router.route("/:recipient").post(authenticateUser, sendMail);
module.exports = router;
