const express = require("express");
const router = express.Router();
const seniorOnboardingController = require("../controllers/seniorOnboardingController");

router.get("/search", seniorOnboardingController.searchSeniorOnboarding);
router.get("/admin-profile", seniorOnboardingController.getAdminProfile);

router.post("/add", seniorOnboardingController.addSeniorEmployee);
router.post("/send-credentials", seniorOnboardingController.sendCredentials);
router.get("/recent", seniorOnboardingController.getRecentOnboardings);

module.exports = router;
