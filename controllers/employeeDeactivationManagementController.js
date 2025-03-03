const Employee = require("../models/Employee");
const ActivityLog = require("../models/ActivityLog");

// Search Employees
exports.searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { employeeID: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } },
      ],
    };

    const employees = await Employee.find(filter);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error searching employees", error });
  }
};

// Bulk Actions (Deactivate Multiple Employees)
exports.bulkDeactivate = async (req, res) => {
  try {
    const { ids } = req.body;
    await Employee.updateMany(
      { _id: { $in: ids } },
      { status: "deactivated", deactivationDate: new Date() }
    );
    res.status(200).json({ message: "Employees deactivated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error performing bulk deactivation", error });
  }
};

// Process Employee Deactivation
exports.processDeactivation = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndUpdate(
      id,
      { status: "deactivated", deactivationDate: new Date() },
      { new: true }
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res
      .status(200)
      .json({ message: "Employee deactivated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error processing deactivation", error });
  }
};

// Mark as Deactivation Completed
exports.markDeactivationCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndUpdate(
      id,
      { status: "deactivated" },
      { new: true }
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res
      .status(200)
      .json({ message: "Employee marked as deactivation completed", employee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking deactivation as completed", error });
  }
};

// Edit Employee
exports.editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedEmployee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};

// Update Deactivation Checklist
exports.updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { checklist } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      id,
      { deactivationChecklist: checklist },
      { new: true }
    );
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error updating checklist", error });
  }
};

// Add Notes and Comments
exports.addNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      id,
      { notes },
      { new: true }
    );
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error adding notes", error });
  }
};

// Get Recent Activity Logs
exports.getRecentLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ updatedAt: -1 }).limit(2);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error });
  }
};
