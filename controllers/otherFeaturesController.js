const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const InternWork = require("../models/InternWork");
const Notification = require("../models/Notification");
const Project = require("../models/Project");
const ActivityLog = require("../models/ActivityLog");

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne().select("name role profilePhoto");

    if (!admin) {
      return res.status(404).json({ message: "Admin profile not found." });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin profile", error });
  }
};

// Global Search
exports.searchGlobally = async (req, res) => {
  try {
    const { query, category, page = 1, limit = 10 } = req.query;
    if (!query)
      return res.status(400).json({ message: "Search query is required" });

    const searchRegex = new RegExp(query, "i"); // Case-insensitive regex
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    let results = {};

    if (!category || category === "employees") {
      results.employees = await Employee.find({
        $or: [
          { fullName: searchRegex },
          { email: searchRegex },
          { employeeId: searchRegex },
          { department: searchRegex },
          { role: searchRegex },
        ],
      })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
    }

    if (!category || category === "internWork") {
      results.internWork = await InternWork.find({
        $or: [
          { internName: searchRegex },
          { assignedProject: searchRegex },
          { teamLead: searchRegex },
        ],
      })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
    }

    if (!category || category === "notifications") {
      results.notifications = await Notification.find({
        $or: [{ title: searchRegex }, { employerName: searchRegex }],
      })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
    }

    if (!category || category === "projects") {
      results.projects = await Project.find({
        $or: [{ title: searchRegex }, { description: searchRegex }],
      })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
    }

    if (!category || category === "activityLogs") {
      results.activityLogs = await ActivityLog.find({
        $or: [
          { activityName: searchRegex },
          { employeeName: searchRegex },
          { modifiedBy: searchRegex },
        ],
      })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
    }

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: "Error in search", error });
  }
};
