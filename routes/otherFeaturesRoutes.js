const express = require("express");
const router = express.Router();
const otherFeaturesController = require("../controllers/otherFeaturesController");

router.get("/admin-profile", otherFeaturesController.getAdminProfile);
router.get("/search", otherFeaturesController.searchGlobally);

module.exports = router;
