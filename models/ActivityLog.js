const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  activityName: { type: String, required: true },
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  modifiedBy: { type: String, required: true }, // Admin User
  modifiedAt: { type: Date, default: Date.now },
  reason: { type: String },
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;
