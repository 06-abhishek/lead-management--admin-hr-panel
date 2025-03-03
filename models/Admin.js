const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    profilePhoto: { type: String },

    password: { type: String, required: true },

    settings: {
      language: { type: String, default: "English" },
      twoFactorAuth: { type: Boolean, default: false },
      mobilePushNotifications: { type: Boolean, default: true },
      desktopNotifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
    },

    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
