const Event = require("../models/Event");
const Notification = require("../models/Notification");

exports.createEvent = async (req, res) => {
  const { title, description,  date } = req.body;
  const imagePath = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : "";
  const newEvent = await Event.create({
    title,
    description,
    image : imagePath,
    date,
    createdBy: req.user.id
  });
  res.status(201).json(newEvent);
};

exports.getEvents = async (req, res) => {
    const { title } = req.query;

    let filter = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" }; // case-insensitive search
    }

    const events = await Event.find(filter).populate("createdBy", "username");
    res.json(events);
  };

exports.getEventsByUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const events = await Event.find({ createdBy: userId }).sort({ date: -1 });
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };

exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ msg: "Event not found" });
  res.json(event);
};

exports.updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ msg: "Event not found" });

  if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ msg: "Unauthorized" });
  }

  const changes = [];
  const { title, description, image, date } = req.body;

  if (title && title !== event.title) changes.push(`Title changed from "${event.title}" to "${title}"`);
  if (description && description !== event.description) changes.push("Description updated");
  if (image && image !== event.image) changes.push("Image updated");
  if (date && new Date(date).toISOString() !== event.date.toISOString()) {
    changes.push(`Date changed from "${event.date.toDateString()}" to "${new Date(date).toDateString()}"`);
  }

  // Save changes to event
  event.title = title || event.title;
  event.description = description || event.description;
  event.image = image || event.image;
  event.date = date || event.date;
  await event.save();

  if (changes.length > 0) {
    await Notification.create({
      eventId: event._id,
      updatedBy: req.user.id,
      changes
    });
  }
  res.json(event);
};


exports.deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ msg: "Event not found" });

  if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ msg: "Unauthorized" });
  }

  await Event.findByIdAndDelete(req.params.id);
  res.json({ msg: "Event deleted" });
};
