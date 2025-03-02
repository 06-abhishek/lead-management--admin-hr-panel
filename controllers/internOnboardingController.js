const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const { sendEmail } = require("../utils/sendOTP");

// Search Intern Onboarding
exports.searchInternOnboarding = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: "Search query is required." });

    const results = await Employee.find({
      position: { $regex: "intern", $options: "i" },
      fullName: { $regex: query, $options: "i" },
    });

    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching intern onboarding", error });
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

// Add Intern Employee (Onboarding)
exports.addInternEmployee = async (req, res) => {
  try {
    const {
      fullName,
      employeeId,
      department,
      role,
      email,
      phone,
      joinDate,
      username,
      password,
    } = req.body;

    if (
      !fullName ||
      !employeeId ||
      !department ||
      !role ||
      !email ||
      !phone ||
      !joinDate ||
      !username ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newEmployee = new Employee({
      fullName,
      employeeId,
      department,
      role,
      position: "intern",
      email,
      phone,
      joinDate,
      username,
      password,
      status: "pending",
    });

    await newEmployee.save();
    res.status(201).json({
      message: "Intern Employee onboarded successfully.",
      employee: newEmployee,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error onboarding intern employee", error });
  }
};

// Send Credentials via Email (Using Existing Utility)
exports.sendCredentials = async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body;
    if (!email || !username || !password || !fullName) {
      return res.status(400).json({
        message: "Email, username, fullName, and password are required.",
      });
    }

    const subject = "Your Intern Employee Account Credentials";
    const message = `Hello ${fullName},\n\nYour account has been created successfully.\n\nUsername: ${username}\nPassword: ${password}\n\nPlease login and change your password.\n\nBest Regards, Admin`;

    await sendEmail(email, subject, message);
    res.status(200).json({ message: "Credentials sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
};

// Get Recent Intern Onboardings
exports.getRecentOnboardings = async (req, res) => {
  try {
    const recentOnboardings = await Employee.find({
      position: { $regex: "intern", $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json(recentOnboardings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching recent onboardings", error });
  }
};
