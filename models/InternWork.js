const mongoose = require("mongoose");

const InternWorkSchema = new mongoose.Schema(
  {
    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    internName: { type: String, required: true },
    designation: { type: String, required: true },
    assignedProject: { type: String, required: true },
    teamLead: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InternWork", InternWorkSchema);
