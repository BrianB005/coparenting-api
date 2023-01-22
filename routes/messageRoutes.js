const express = require("express");
const { sendMessage, getSingleChat } = require("../controllers/messageController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.route("/").post(authenticateUser,sendMessage);
router.route("/:recipient").post(authenticateUser,getSingleChat);

module.exports = router;
