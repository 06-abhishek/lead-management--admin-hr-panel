const express = require("express");
const adminAuthController = require("../controllers/adminAuthController");
const { upload } = require("../utils/cloudinary");

const router = express.Router();

router.post("/signup", upload.single("profilePhoto"), adminAuthController.signUp);
router.post("/login", adminAuthController.login);
router.post("/forgot-password", adminAuthController.forgotPassword);
router.post("/verify-otp", adminAuthController.verifyOtp);

module.exports = router;
