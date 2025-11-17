// backend/controllers/employeeController.js
import asyncHandler from "express-async-handler";
import Employee from "../models/employeeModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(path.resolve(), "uploads");
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `employee-${Date.now()}${ext}`);
  },
});
export const upload = multer({ storage });

// @desc User apply to become employee (driver)
export const createEmployee = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      experience,
      qualification,
      vehicleType,
      licenseNumber,
      availability,
      notes,
    } = req.body;

    if (!name || !email) {
      res.status(400);
      throw new Error("Name and email are required");
    }

    const employeeData = {
      name,
      email,
      phone,
      experience: experience ? Number(experience) : 0,
      qualification,
      vehicleType,
      licenseNumber,
      availability: availability === "true" || availability === true,
      notes,
    };

    if (req.file) {
      employeeData.profilePicture = `/uploads/${req.file.filename}`;
    }

    // attach logged-in user if exists
    if (req.user && req.user._id) employeeData.applicantUser = req.user._id;

    const created = await Employee.create(employeeData);
    res.status(201).json({ message: "Application submitted", employee: created });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// @desc Get all applicants (admin)
export const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().populate("applicantUser", "name email");
  res.json(employees);
});

// @desc Get single employee (admin)
export const getEmployee = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id).populate("applicantUser", "name email");
  if (!emp) {
    res.status(404);
    throw new Error("Employee not found");
  }
  res.json(emp);
});

// @desc Approve / Reject applicant (admin)
export const updateEmployeeStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body; // status = Approved / Rejected / Pending
  const emp = await Employee.findById(req.params.id);
  if (!emp) {
    res.status(404);
    throw new Error("Employee not found");
  }
  if (status) emp.status = status;
  if (typeof notes !== "undefined") emp.notes = notes;
  const updated = await emp.save();
  res.json(updated);
});

// @desc Delete applicant (admin)
export const deleteEmployee = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) {
    res.status(404);
    throw new Error("Employee not found");
  }
  // remove profile pic file if exists
  if (emp.profilePicture) {
    const filePath = path.join(path.resolve(), emp.profilePicture);
    fs.unlink(filePath, (err) => { /* ignore */ });
  }
  await emp.deleteOne();
  res.json({ message: "Employee removed" });
});

// @desc Get logged-in user's application (if they want to see their application)
export const getMyApplication = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const app = await Employee.findOne({ applicantUser: req.user._id });
  res.json(app || {});
});
// @desc Update logged-in user's employee profile
export const updateMyEmployee = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const existing = await Employee.findOne({ applicantUser: req.user._id });
  if (!existing) {
    res.status(404);
    throw new Error("No application found for this user");
  }

  const fields = [
    "name",
    "email",
    "phone",
    "experience",
    "qualification",
    "vehicleType",
    "licenseNumber",
    "availability",
    "notes",
  ];

  fields.forEach((f) => {
    if (typeof req.body[f] !== "undefined") existing[f] = req.body[f];
  });

  const updated = await existing.save();
  res.json({ message: "Profile updated successfully", employee: updated });
});
