const express = require("express");
const { addImages, getImages } = require("../controllers/galleryController");

const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .post(authenticateUser, addImages)
  .get(authenticateUser, getImages);

module.exports = router;
