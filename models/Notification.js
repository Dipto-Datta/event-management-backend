const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changes: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);