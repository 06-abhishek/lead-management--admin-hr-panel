const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/", notificationController.getAllNotifications);
router.get("/unread", notificationController.getUnreadNotifications);
router.put("/mark-read/:id", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);
router.get("/priority-alerts", notificationController.getPriorityAlerts);
router.get("/history", notificationController.getNotificationHistory);
router.get("/system-status", notificationController.getSystemStatus);

module.exports = router;
