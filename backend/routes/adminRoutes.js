import express from "express";
import {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getAllBookingsAdmin,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id", protect, adminOnly, updateUserByAdmin);
router.delete("/users/:id", protect, adminOnly, deleteUserByAdmin);

router.get("/bookings", protect, adminOnly, getAllBookingsAdmin);
router.put("/bookings/:id", protect, adminOnly, updateBookingStatus);
router.delete("/bookings/:id", protect, adminOnly, deleteBooking);

export default router;
