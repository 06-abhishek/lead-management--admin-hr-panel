const express = require('express');
const router = express.Router();
const employeeActivationController = require('../controllers/employeeActivationManagementController');

router.get('/stats', employeeActivationController.getDashboardData);

router.get('/search', employeeActivationController.searchEmployees);
router.put('/activate/:id', employeeActivationController.activateEmployee);
router.put('/reject/:id', employeeActivationController.rejectEmployee);

router.get('/logs', employeeActivationController.getRecentLogs);

module.exports = router;
