// backend/routes/employeeRoutes.js
import express from "express";
import {
  createEmployee,
  getAllEmployees,
  updateEmployeeStatus,
  deleteEmployee,
  getEmployee,
  getMyApplication,updateMyEmployee,
  upload,
} from "../controllers/employeeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public/Protected: user applies (protected so we can link to user; optional)
router.post("/", protect, upload.single("profilePicture"), createEmployee);

// Allow applicant to view their application
router.get("/me", protect, getMyApplication);
// User can update their own employee profile (not admin-only)
router.put("/me", protect, updateMyEmployee);


// Admin routes
router.get("/", protect, adminOnly, getAllEmployees);
router.get("/:id", protect, adminOnly, getEmployee);
router.put("/:id/status", protect, adminOnly, updateEmployeeStatus);
router.delete("/:id", protect, adminOnly, deleteEmployee);

export default router;
