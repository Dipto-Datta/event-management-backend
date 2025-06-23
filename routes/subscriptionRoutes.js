const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { checkEventLogs } = require("../controllers/subscriptionController");


const {
  subscribe,
  unsubscribe,
  getUserSubscriptions,
  getSubscriptionStatus
} = require("../controllers/subscriptionController");


router.get("/check-logs", auth(["user", "admin"]), checkEventLogs);
router.post("/status", auth(["user", "admin"]), getSubscriptionStatus);
router.get("/", auth(["user", "admin"]), getUserSubscriptions);
router.post("/:eventId", auth(["user", "admin"]), subscribe);
router.delete("/:eventId", auth(["user", "admin"]), unsubscribe);



module.exports = router;
