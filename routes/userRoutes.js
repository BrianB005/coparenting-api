const express = require("express");
const {
  getUsers,
  getCurrentUser,
  addCoparent,
  updateUser,
} = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
// router.route("/").get([authenticateUser,authorizePermissions("admin")],getUsers);
router.route("/").get(getUsers);
router.route("/:userId").put(authenticateUser, addCoparent);
router.route("/current").get(authenticateUser, getCurrentUser);
router.route("/current/update").put(authenticateUser, updateUser);

module.exports = router;
