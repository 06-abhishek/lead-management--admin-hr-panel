const express = require("express");
const router = express.Router();
const internOnboardingController = require("../controllers/internOnboardingController");

// Search Intern Onboarding
router.get("/search", internOnboardingController.searchInternOnboarding);

// Get Admin Profile
router.get("/admin-profile", internOnboardingController.getAdminProfile);

// Add Intern Employee
router.post("/add", internOnboardingController.addInternEmployee);

// Send Credentials via Email
router.post("/send-credentials", internOnboardingController.sendCredentials);

// Get Recent Onboardings
router.get("/recent", internOnboardingController.getRecentOnboardings);

module.exports = router;
