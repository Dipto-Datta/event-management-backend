const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", auth(["user", "admin"]),upload.single("image"), createEvent);
router.put("/:id", auth(["user", "admin"]), updateEvent);
router.delete("/:id", auth(["user", "admin"]), deleteEvent);

module.exports = router;
