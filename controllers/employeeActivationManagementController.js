const Employee = require("../models/Employee");
const ActivityLog = require("../models/ActivityLog");

// Get Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const pendingCount = await Employee.countDocuments({ status: "pending" });
    const activatedToday = await Employee.countDocuments({
      status: "active",
      activationDate: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const failedActivation = await Employee.countDocuments({
      status: "rejected",
    });
    const totalActive = await Employee.countDocuments({ status: "active" });

    res
      .status(200)
      .json({ pendingCount, activatedToday, failedActivation, totalActive });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

// Search Employees
exports.searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;
    const employees = await Employee.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { employeeID: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error searching employees", error });
  }
};

// Activate Employee
exports.activateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndUpdate(
      id,
      { status: "active", activationDate: new Date() },
      { new: true }
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res
      .status(200)
      .json({ message: "Employee activated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error activating employee", error });
  }
};

// Reject Employee
exports.rejectEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res
      .status(200)
      .json({ message: "Employee rejected successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting employee", error });
  }
};

// Get Recent Activity Logs
exports.getRecentLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ updatedAt: -1 }).limit(5);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error });
  }
};
