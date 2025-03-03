const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["ongoing", "completed", "on-hold"],
    default: "ongoing",
  },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", ProjectSchema);
