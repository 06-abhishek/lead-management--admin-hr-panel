const Notification = require("../models/Notification");
const Employee = require("../models/Employee");

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// Get unread notifications
exports.getUnreadNotifications = async (req, res) => {
  try {
    const unreadNotifications = await Notification.find({ read: false });
    res.status(200).json(unreadNotifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching unread notifications", error });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id is required" });

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notification as read", error });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id is required" });

    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
};

// Get priority alerts
exports.getPriorityAlerts = async (req, res) => {
  try {
    const alerts = await Notification.find({
      type: { $in: ["account_request", "deactivation_request"] },
    });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching priority alerts", error });
  }
};

// Approve or reject account request
exports.processAccountRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approved' or 'rejected'

    if (!id) return res.status(400).json({ message: "id is required" });
    if (!action) return res.status(400).json({ message: "action is required" });

    const notification = await Notification.findById(id);
    if (!notification)
      return res.status(404).json({ message: "notification not found" });

    let updateFields = {};
    if (action === "approved") {
      updateFields.isApproved = true;
    } else if (action === "rejected") {
      updateFields.status = "rejected";
    } else {
      return res
        .status(400)
        .json({ message: "action must be 'approved' or 'rejected'" });
    }

    const employee = await Employee.findByIdAndUpdate(
      notification.employerId,
      updateFields,
      { new: true }
    );

    res
      .status(200)
      .json({ message: `Account request ${action}`, employee, notification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing account request", error });
  }
};

// Process account deactivation request
exports.processDeactivationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id is required" });

    const notification = await Notification.findById(id);
    if (!notification)
      return res.status(404).json({ message: "notification not found" });

    const employee = await Employee.findByIdAndUpdate(
      notification.employerId,
      { status: "deactivated" },
      { new: true }
    );

    res.status(200).json({
      message: "Deactivation request processed",
      notification,
      employee,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing deactivation request", error });
  }
};

// Get notification history
exports.getNotificationHistory = async (req, res) => {
  try {
    const history = await Notification.find().sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notification history", error });
  }
};

// Get system status
exports.getSystemStatus = async (req, res) => {
  try {
    const pendingRequests = await Notification.countDocuments({
      status: "pending",
    });
    res.status(200).json({
      systemStatus: "online",
      lastSynced: new Date(),
      pendingRequests,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching system status", error });
  }
};
