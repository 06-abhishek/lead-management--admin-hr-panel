const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    position: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    joinDate: { type: Date, required: true },
    username: { type: String, unique: true },
    password: { type: String },
    status: { type: String, enum: ["active", "inactive", "pending"], default: "pending" },
    lastActive: { type: Date },
    profilePic: { type: String },
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
