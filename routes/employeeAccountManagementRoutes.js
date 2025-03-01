const express = require("express");
const router = express.Router();
const employeeAccountController = require("../controllers/employeeAccountManagementController");

router.get("/search", employeeAccountController.searchEmployeeAccount);
router.get("/admin-profile", employeeAccountController.getAdminProfile);

router.get("/stats", employeeAccountController.getAccountStats);

router.get("/status-search", employeeAccountController.searchEmployeeStatus);
router.post("/batch-activate", employeeAccountController.batchActivateEmployees);
router.post("/batch-deactivate", employeeAccountController.batchDeactivateEmployees);

router.put("/update-profile/:employeeId", employeeAccountController.updateEmployeeProfile);
router.put("/update-status/:employeeId", employeeAccountController.updateEmployeeStatus);

router.put("/submit-status-update/:employeeId", employeeAccountController.submitStatusUpdate);
router.get("/recent-logs", employeeAccountController.getRecentLogs);

module.exports = router;
