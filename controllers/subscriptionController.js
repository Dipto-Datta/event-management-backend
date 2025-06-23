const Subscription = require("../models/Subscription");
const Event = require("../models/Event");
const Notification = require("../models/Notification");

exports.subscribe = async (req, res) => {
    const eventId = req.params.eventId;

    const exists = await Subscription.findOne({ userId: req.user.id, eventId });
    if (exists) return res.status(400).json({ msg: "Already subscribed" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    const snapshot = {
      title: event.title,
      description: event.description,
      image: event.image,
      date: event.date
    };

    const sub = await Subscription.create({
      userId: req.user.id,
      eventId,
      snapshot
    });

    res.status(201).json(sub);
  };

exports.unsubscribe = async (req, res) => {
  await Subscription.findOneAndDelete({ userId: req.user.id, eventId: req.params.eventId });
  res.json({ msg: "Unsubscribed successfully" });
};

exports.getUserSubscriptions = async (req, res) => {
  const subs = await Subscription.find({ userId: req.user.id }).populate("eventId");
  res.json(subs);
};

exports.getSubscriptionStatus = async (req, res) => {
    try {
      const { eventIds } = req.body;

      if (!Array.isArray(eventIds)) {
        return res.status(400).json({ msg: "eventIds must be an array" });
      }

      const subs = await Subscription.find({
        userId: req.user.id,
        eventId: { $in: eventIds }
      });

      const status = eventIds.map(id => ({
        eventId: id,
        isSubscribed: subs.some(sub => sub.eventId.toString() === id)
      }));

      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };


  // manual update trigger mechanism --/

  exports.checkEventLogs = async (req, res) => {
    try {
      const subs = await Subscription.find({ userId: req.user.id });

      const result = [];

      for (const sub of subs) {
        const logs = await Notification.find({
          eventId: sub.eventId,
          createdAt: { $gt: sub.subscribedAt }
        }).sort({ createdAt: -1 });

        if (logs.length > 0) {
          result.push({
            eventId: sub.eventId,
            eventTitle: sub.snapshot.title,
            updates: logs.map(log => ({
              changes: log.changes,
              updatedBy: log.updatedBy,
              at: log.createdAt
            }))
          });
        }
      }

      res.json(result.length ? result : ["No new updates on your subscribed events."]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };
