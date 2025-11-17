// backend/models/employeeModel.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    applicantUser: { // optional link if logged-in user applied
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    experience: { type: Number, default: 0 }, // years
    qualification: { type: String },
    vehicleType: { type: String }, // Sedan, SUV...
    licenseNumber: { type: String },
    rating: { type: Number, default: 0 }, // optional starting rating
    availability: { type: Boolean, default: true },
    profilePicture: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    notes: { type: String }, // admin notes
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
