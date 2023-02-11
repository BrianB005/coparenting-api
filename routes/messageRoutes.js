const express = require("express");
const {
  sendMessage,
  getSingleChat,
} = require("../controllers/messageController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .post(authenticateUser, sendMessage)
  .get(authenticateUser, getSingleChat);

module.exports = router;
