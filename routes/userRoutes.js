const express = require("express");
const { getUsers, getCurrentUser } = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

// router.route("/").get([authenticateUser,authorizePermissions("admin")],getUsers);
router.route("/").get(getUsers);
router.route("/current").get(authenticateUser, getCurrentUser);

module.exports = router;
