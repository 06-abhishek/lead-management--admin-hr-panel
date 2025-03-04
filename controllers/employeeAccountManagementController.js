const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const ActivityLog = require("../models/ActivityLog");

// Search Employee Account Management
exports.searchEmployeeAccount = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: "Search query is required." });

    const employees = await Employee.find({
      fullName: { $regex: query, $options: "i" },
    });

    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching employee accounts", error });
  }
};

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne().select("name role profilePhoto");

    if (!admin)
      return res.status(404).json({ message: "Admin profile not found." });

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin profile", error });
  }
};

// Get Employee Account Statistics
exports.getAccountStats = async (req, res) => {
  try {
    const activeCount = await Employee.countDocuments({ status: "active" });
    const inactiveCount = await Employee.countDocuments({ status: "inactive" });
    const pendingCount = await Employee.countDocuments({ status: "pending" });

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const newAccounts = await Employee.countDocuments({
      createdAt: { $gte: last30Days },
    });

    res
      .status(200)
      .json({ activeCount, inactiveCount, pendingCount, newAccounts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching account statistics", error });
  }
};

// Employee Status Controller (Search & Pagination)
exports.searchActivateEmployeeStatus = async (req, res) => {
  try {
    const {
      name,
      id,
      email,
      department,
      status,
      page = 1,
      limit = 10,
    } = req.query;
    let filter = { status: "active" };

    if (name) filter.fullName = { $regex: name, $options: "i" };
    if (id) filter.employeeId = id;
    if (email) filter.email = email;
    if (department) filter.department = department;
    if (status) filter.status = status;

    const employees = await Employee.find(filter)
      .select("fullName employeeId profilePic department lastActive status")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const totalResults = await Employee.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    res.status(200).json({ employees, totalResults, totalPages, page });
  } catch (error) {
    res.status(500).json({ message: "Error searching employees", error });
  }
};

// Employee Status Controller (Search & Pagination)
exports.searchDeactivateEmployeeStatus = async (req, res) => {
  try {
    const {
      name,
      id,
      email,
      department,
      status,
      page = 1,
      limit = 10,
    } = req.query;
    let filter = { status: "inactive" };

    if (name) filter.fullName = { $regex: name, $options: "i" };
    if (id) filter.employeeId = id;
    if (email) filter.email = email;
    if (department) filter.department = department;
    if (status) filter.status = status;

    const employees = await Employee.find(filter)
      .select("fullName employeeId profilePic department lastActive status")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const totalResults = await Employee.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    res.status(200).json({ employees, totalResults, totalPages, page });
  } catch (error) {
    res.status(500).json({ message: "Error searching employees", error });
  }
};

// Update Employee Profile
exports.updateEmployeeProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { fullName, department, position, email, phone, } =
      req.body;

    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId },
      { fullName, department, position, email, phone },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({
      message: "Employee profile updated successfully.",
      updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee profile", error });
  }
};

// Update Employee Status
exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.body;

    const employee = await Employee.findOneAndUpdate(
      { employeeId },
      { status },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res
      .status(200)
      .json({ message: "Employee status updated successfully.", employee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee status", error });
  }
};

// Status Update Form - Submit Deactivation Details
exports.submitStatusUpdate = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status, reason, effectiveDate, comments } = req.body;

    // Check if all required fields are provided
    if (!status || !reason || !effectiveDate) {
      return res
        .status(400)
        .json({ message: "Status, Reason, and Effective Date are required." });
    }

    // Find and update the employee status
    const employee = await Employee.findOneAndUpdate(
      { employeeId },
      { status, deactivationReason: reason, effectiveDate, comments },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Log Activity
    const log = new ActivityLog({
      activityName: "Status Update",
      employeeId,
      employeeName: employee.fullName,
      modifiedBy: "Admin",
      reason,
      effectiveDate,
      comments,
    });
    await log.save();

    res
      .status(200)
      .json({ message: "Employee status updated successfully.", employee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee status", error });
  }
};

// Get Recent Activity Logs
exports.getRecentLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ modifiedAt: -1 }).limit(5);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent logs", error });
  }
};
