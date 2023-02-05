const express = require("express");
const {
  sendMessage,
  getSingleChat,
} = require("../controllers/messageController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
const multer = require("multer");
const upload = multer();
router
  .route("/")
  .post([authenticateUser, upload.single("image")], sendMessage)
  .get(authenticateUser, getSingleChat);

module.exports = router;
