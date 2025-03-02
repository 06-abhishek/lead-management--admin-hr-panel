const Employee = require("../models/Employee");
const Project = require("../models/Project");
const Admin = require("../models/Admin");

// Search on Dashboard
exports.searchDashboard = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: "Search query is required." });

    const employees = await Employee.find({
      fullName: { $regex: query, $options: "i" },
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
    const admin = await Admin.findOne().select("name role profilePhoto");

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
    const { filter } = req.query; // "daily", "weekly", "monthly"
    let startDate, endDate, groupByFormat, incrementDate;

    const today = new Date();
    if (filter === "daily") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 29); // Last 30 days
      groupByFormat = "%Y-%m-%d";
      incrementDate = (date) => {
        date.setDate(date.getDate() + 1);
        return date;
      };
    } else if (filter === "weekly") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 83); // Last 12 weeks
      groupByFormat = "%Y-%U"; // Year-Week number
      incrementDate = (date) => {
        date.setDate(date.getDate() + 7);
        return date;
      };
    } else if (filter === "monthly") {
      startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1); // Last 12 months
      groupByFormat = "%Y-%m";
      incrementDate = (date) => {
        date.setMonth(date.getMonth() + 1);
        return date;
      };
    } else {
      return res.status(400).json({
        message: "Invalid filter type. Use 'daily', 'weekly', or 'monthly'.",
      });
    }

    endDate = new Date(); // Current date

    // Fetch data from DB
    const performanceData = await Employee.aggregate([
      { $match: { lastUpdated: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: groupByFormat, date: "$lastUpdated" },
          },
          averagePerformance: { $avg: "$performance" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing dates with 0 performance
    const result = [];
    let dateIterator = new Date(startDate);

    while (dateIterator <= endDate) {
      let formattedDate;
      if (filter === "daily") {
        formattedDate = dateIterator.toISOString().split("T")[0];
      } else if (filter === "weekly") {
        formattedDate = `${dateIterator.getFullYear()}-${Math.ceil(
          dateIterator.getDate() / 7
        )}`;
      } else if (filter === "monthly") {
        formattedDate = `${dateIterator.getFullYear()}-${(
          dateIterator.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}`;
      }

      const existingData = performanceData.find(
        (item) => item._id === formattedDate
      );
      result.push({
        date: formattedDate,
        averagePerformance: existingData ? existingData.averagePerformance : 0,
      });

      dateIterator = incrementDate(dateIterator);
    }

    res.status(200).json({
      message: "Employee performance data fetched successfully.",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
