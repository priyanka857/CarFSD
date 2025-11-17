import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Update user by admin
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new Error("User not found");
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  await user.save();
  res.json(user);
});

// Delete user
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin")
    return res.status(403).json({ message: "Cannot delete admin user" });
  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});

// Get all bookings
export const getAllBookingsAdmin = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate("user car");
  res.json(bookings);
});

// Update booking status
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new Error("Booking not found");
  booking.status = req.body.status || booking.status;
  await booking.save();
  res.json(booking);
});

// Delete booking
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new Error("Booking not found");
  await booking.deleteOne();
  res.json({ message: "Booking deleted" });
});
