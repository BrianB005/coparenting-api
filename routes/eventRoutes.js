const { Router } = require("express");
const {
  createEvent,
  getEvents,
  updateEvent,
} = require("../controllers/eventControllers");
const { authenticateUser } = require("../middleware/authentication");

const router = Router();

router
  .route("/")
  .post(authenticateUser, createEvent)
  .get(authenticateUser, getEvents);

router.route("/:id").put(authenticateUser, updateEvent);

module.exports = router;
