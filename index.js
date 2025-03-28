const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./database/db");

const app = express();
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json());
const port = process.env.PORT || 4000;
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Lead Management Server");
});

// 1-4 & 16: Admin Authentication
const adminAuthRoutes = require("./routes/adminAuthRoutes");
app.use("/api/auth", adminAuthRoutes);

// 5: Dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// 6: Senior Onboarding
const seniorOnboardingRoutes = require("./routes/seniorOnboardingRoutes");
app.use("/api/senior-onboarding", seniorOnboardingRoutes);

// 7: Intern Onboarding
const internOnboardingRoutes = require("./routes/internOnboardingRoutes");
app.use("/api/intern-onboarding", internOnboardingRoutes);

// 8: Employee Account Management
const employeeAccountManagementRoutes = require("./routes/employeeAccountManagementRoutes");
app.use("/api/employee-account-management", employeeAccountManagementRoutes);

// 9: Employee Activation Management
const employeeActivationManagementRoutes = require("./routes/employeeActivationManagementRoutes");
app.use(
  "/api/employee-activation-management",
  employeeActivationManagementRoutes
);

// 10-12: Employee Deactivation Management, Process Deactivation, Mark as Completed
const employeeDeactivationManagementRoutes = require("./routes/employeeDeactivationManagementRoutes");
app.use(
  "/api/employee-deactivation-management",
  employeeDeactivationManagementRoutes
);

// 13: Intern Assigned Work
const internAssignedWorkRoutes = require("./routes/internAssignedWorkRoutes");
app.use("/api/intern-assigned-work", internAssignedWorkRoutes);

// 14: Notification
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notification", notificationRoutes);

// 15: Settings
const settingsRoutes = require("./routes/settingsRoutes");
app.use("/api/settings", settingsRoutes);

// Other Feature: Search and Admin Profile
const otherFeaturesRoutes = require("./routes/otherFeaturesRoutes");
app.use("/api/features", otherFeaturesRoutes);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

module.exports = app;
