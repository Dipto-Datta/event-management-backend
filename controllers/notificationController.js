const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).populate("eventId");
  res.json(notifications);
};

exports.createNotification = async (req, res) => {
  const { userId, eventId, message } = req.body;
  const notification = await Notification.create({ userId, eventId, message });
  res.status(201).json(notification);
};
