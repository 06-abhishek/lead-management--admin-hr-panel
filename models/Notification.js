const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    employerName: { type: String, required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },

    processedBy: { type: String },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["pending", "completed", "incomplete"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["account_request", "deactivation_request", "general"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
