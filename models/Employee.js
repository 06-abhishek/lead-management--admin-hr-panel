const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    profilePic: { type: String },

    employeeId: { type: String, unique: true },
    role: { type: String },
    department: { type: String },
    position: { type: String },
    

    username: { type: String, unique: true },
    email: { type: String, unique: true },
    phone: { type: String },
    password: { type: String },

    performance: { type: Number, default: 0 }, // Performance in %

    joinDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    lastActive: { type: Date },

    lastUpdated: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
