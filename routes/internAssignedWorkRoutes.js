const express = require('express');
const router = express.Router();
const internWorkController = require('../controllers/internAssignedWorkController');

router.get('/', internWorkController.getAllAssignedWork);

router.get('/:id', internWorkController.getWorkById);
router.put('/:id', internWorkController.editWork);
router.delete('/:id', internWorkController.deleteWork);

router.get('/search', internWorkController.searchWork);

module.exports = router;
