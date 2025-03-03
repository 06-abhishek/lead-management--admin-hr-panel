const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendOTP");

// Admin SignUp
exports.signUp = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const profilePhoto = req.file ? req.file.path : "";

    if (!name || !email || !role || !password)
      return res.status(400).json({ message: "Please fill required fields" });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({
      name,
      email,
      role,
      password: hashedPassword,
      profilePhoto,
    });
    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin registered successfully", newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email or password is required" });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const otp = crypto.randomInt(10000, 99999).toString();
    admin.otp = otp;
    admin.otpExpiry = Date.now() + 10 * 60 * 1000;
    await admin.save();

    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);
    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({ message: "OTP is invalid" });
    }
    if (Date.now() > admin.otpExpires) {
      return res.status(400).json({ message: "OTP is expired" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Clear OTP after verification
    await Admin.findByIdAndUpdate(
      admin._id,
      {
        $unset: { otp: 1, otpExpiry: 1 },
      },
      { new: true }
    );

    res.status(200).json({ message: "OTP verified.", token, admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Clear the authentication cookie on ServiceEngineer's Sign Out
exports.signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Successfully signed out" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
