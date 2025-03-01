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
  res.send("Welcome to Service Engineer Application");
});

// 5: Dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// 6: Senior Onboarding
const seniorOnboardingRoutes = require("./routes/seniorOnboardingRoutes");
app.use("/api/senior-onboarding", seniorOnboardingRoutes);

// 6: Intern Onboarding
const internOnboardingRoutes = require("./routes/internOnboardingRoutes");
app.use("/api/intern-onboarding", internOnboardingRoutes);

// 7: Employee Account Management
const employeeAccountManagementRoutes = require("./routes/employeeAccountManagementRoutes");
app.use("/api/employee-account-management", employeeAccountManagementRoutes);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

module.exports = app;
