const Employee = require("../models/Employee");
const Project = require("../models/Project");

// Search on Dashboard
exports.searchDashboard = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: "Search query is required." });

    const employees = await Employee.find({
      name: { $regex: query, $options: "i" },
    });
    const projects = await Project.find({
      title: { $regex: query, $options: "i" },
    });

    res.status(200).json({ employees, projects });
  } catch (error) {
    res.status(500).json({ message: "Error searching dashboard", error });
  }
};

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    // Assuming the admin is always the first document in the Employee collection with role "admin"
    const admin = await Employee.findOne({ role: "admin" }).select(
      "name role profilePicture"
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin profile not found." });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin profile", error });
  }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeAccounts = await Employee.countDocuments({ status: "active" });
    const inactiveAccounts = await Employee.countDocuments({
      status: "inactive",
    });
    const totalProjects = await Project.countDocuments();

    // Get yesterday’s count (for % change calculation)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const prevTotalEmployees = await Employee.countDocuments({
      lastUpdated: { $lt: yesterday },
    });
    const prevActiveAccounts = await Employee.countDocuments({
      status: "active",
      lastUpdated: { $lt: yesterday },
    });
    const prevInactiveAccounts = await Employee.countDocuments({
      status: "inactive",
      lastUpdated: { $lt: yesterday },
    });
    const prevTotalProjects = await Project.countDocuments({
      lastUpdated: { $lt: yesterday },
    });

    // Inline function to calculate percentage change
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return 100;
      return ((current - previous) / previous) * 100;
    };

    res.status(200).json({
      totalEmployees,
      activeAccounts,
      inactiveAccounts,
      totalProjects,
      percentageChange: {
        employees: calculatePercentageChange(
          totalEmployees,
          prevTotalEmployees
        ),
        activeAccounts: calculatePercentageChange(
          activeAccounts,
          prevActiveAccounts
        ),
        inactiveAccounts: calculatePercentageChange(
          inactiveAccounts,
          prevInactiveAccounts
        ),
        projects: calculatePercentageChange(totalProjects, prevTotalProjects),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};

// Get Employee Performance Graph Data
exports.getEmployeePerformance = async (req, res) => {
  try {
    const { filter } = req.query; // today, daily, weekly, monthly
    let startDate = new Date();

    if (filter === "daily") startDate.setDate(startDate.getDate() - 1);
    else if (filter === "weekly") startDate.setDate(startDate.getDate() - 7);
    else if (filter === "monthly") startDate.setMonth(startDate.getMonth() - 1);

    const performanceData = await Employee.aggregate([
      { $match: { lastUpdated: { $gte: startDate } } },
      { $group: { _id: null, avgPerformance: { $avg: "$performance" } } },
    ]);

    res.status(200).json({
      performance: performanceData[0]?.avgPerformance || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching performance data", error });
  }
};
