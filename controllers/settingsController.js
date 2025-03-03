const Admin = require("../models/Admin");

// Get settings
exports.getSettings = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin.settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  const {
    language,
    twoFactorAuth,
    mobilePushNotifications,
    desktopNotifications,
    emailNotifications,
  } = req.body;

  const newSetting = {};

  if (language) newSetting.language = language;
  if (twoFactorAuth) newSetting.twoFactorAuth = twoFactorAuth;
  if (mobilePushNotifications)
    newSetting.mobilePushNotifications = mobilePushNotifications;
  if (desktopNotifications)
    newSetting.desktopNotifications = desktopNotifications;
  if (emailNotifications) newSetting.emailNotifications = emailNotifications;

  try {
    const admin = await Admin.findOneAndUpdate(
      {},
      { settings: newSetting },
      { new: true, upsert: true }
    );
    res.status(200).json({
      message: "Settings updated successfully",
      settings: admin.settings,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error });
  }
};
