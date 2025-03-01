const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/search", dashboardController.searchDashboard);
router.get("/admin-profile", dashboardController.getAdminProfile);
router.get("/stats", dashboardController.getDashboardStats);
router.get("/performance", dashboardController.getEmployeePerformance);

module.exports = router;
