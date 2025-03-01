const nodemailer = require("nodemailer");
const twilio = require("twilio");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use an App Password if 2FA is enabled
  },
});

const sendEmail = async (email, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });
    console.log(`Email OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending email OTP:", error);
    throw new Error("Failed to send email OTP");
  }
};

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendPhoneOtp = async (phone, otp) => {
  try {
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log(`Phone OTP sent to ${phone}`);
  } catch (error) {
    console.error("Error sending phone OTP:", error);
    throw new Error("Failed to send phone OTP");
  }
};

module.exports = { sendEmail, sendPhoneOtp };
