import Notification from "../models/Notification.model.js";

/**
 * @desc    Get notifications for logged-in user
 * @route   GET /api/notifications
 * @access  Protected
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

/**
 * @desc    Create notification
 * @route   POST /api/notifications
 * @access  Protected
 */
export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create notification",
      error: error.message,
    });
  }
};