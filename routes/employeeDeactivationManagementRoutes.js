const express = require('express');
const router = express.Router();
const employeeDeactivationController = require('../controllers/employeeDeactivationManagementController');

router.get('/search', employeeDeactivationController.searchEmployees);

router.put('/bulk-deactivate', employeeDeactivationController.bulkDeactivate);
router.put('/deactivate/:id', employeeDeactivationController.processDeactivation);
router.put('/mark-deactivation-completed/:id', employeeDeactivationController.markDeactivationCompleted);

router.put('/edit/:id', employeeDeactivationController.editEmployee);
router.delete('/delete/:id', employeeDeactivationController.deleteEmployee);

router.put('/update-checklist/:id', employeeDeactivationController.updateChecklist);
router.put('/add-notes/:id', employeeDeactivationController.addNotes);
router.get('/logs', employeeDeactivationController.getRecentLogs);

module.exports = router;
