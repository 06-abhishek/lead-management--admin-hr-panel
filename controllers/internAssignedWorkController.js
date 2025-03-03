const InternWork = require("../models/InternWork");

// Get all assigned work (paginated)
exports.getAllAssignedWork = async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const work = await InternWork.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await InternWork.countDocuments();
    res.status(200).json({ total, page, limit, work });
  } catch (error) {
    res.status(500).json({ message: "Error fetching work", error });
  }
};

// View full details of assigned work
exports.getWorkById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id is required" });

    const work = await InternWork.findById(id);
    if (!work) return res.status(404).json({ message: "Work not found" });
    res.status(200).json(work);
  } catch (error) {
    res.status(500).json({ message: "Error fetching work details", error });
  }
};

// Edit assigned work
exports.editWork = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      internName,
      internId,
      designation,
      assignedProject,
      teamLead,
      projectId,
    } = req.body;

    if (!id) return res.status(400).json({ message: "id is required" });

    const updatedWork = {};

    if (internName) updatedWork.internName = internName;
    if (internId) updatedWork.internId = internId;
    if (designation) updatedWork.designation = designation;
    if (assignedProject) updatedWork.assignedProject = assignedProject;
    if (projectId) updatedWork.projectId = projectId;
    if (teamLead) updatedWork.teamLead = teamLead;

    const work = await InternWork.findByIdAndUpdate(id, updatedWork, {
      new: true,
    });
    if (!work) return res.status(404).json({ message: "Work not found" });
    res.status(200).json({ message: "Work updated successfully", work });
  } catch (error) {
    res.status(500).json({ message: "Error updating work", error });
  }
};

// Delete assigned work
exports.deleteWork = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id is required" });

    const work = await InternWork.findByIdAndDelete(id);
    if (!work) return res.status(404).json({ message: "Work not found" });
    res.status(200).json({ message: "Work deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting work", error });
  }
};

// Search assigned work
exports.searchWork = async (req, res) => {
  try {
    const { query } = req.query;
    const work = await InternWork.find({
      $or: [
        { internName: { $regex: query, $options: "i" } },
        { designation: { $regex: query, $options: "i" } },
        { assignedProject: { $regex: query, $options: "i" } },
        { teamLead: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(work);
  } catch (error) {
    res.status(500).json({ message: "Error searching work", error });
  }
};
