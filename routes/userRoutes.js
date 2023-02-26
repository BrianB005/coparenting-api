const express = require("express");
const {
  getUsers,
  getCurrentUser,
  addCoparent,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

// router.route("/").get([authenticateUser,authorizePermissions("admin")],getUsers);
router.route("/").get(getUsers);
router.route("/:userId").put(authenticateUser, addCoparent);
router.route("/current").get(authenticateUser, getCurrentUser);

module.exports = router;
