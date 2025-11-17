import asyncHandler from "express-async-handler";
import Booking from "../models/bookingModel.js";

// ✅ Create Booking
export const createBooking = asyncHandler(async (req, res) => {
  const {
    bookingType,
    pickupLocation,
    dropLocation,
    bookingDate,
    totalAmount,
    vehicleType,
    experience,
    licenseType,
    rating,
  } = req.body;

  if (!bookingType || !pickupLocation || !bookingDate || !totalAmount) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const booking = await Booking.create({
    user: req.user._id,
    bookingType,
    pickupLocation,
    dropLocation: bookingType === "Car" ? dropLocation : undefined,
    bookingDate,
    totalAmount,
    vehicleType: bookingType === "Car" ? vehicleType : undefined,
    experience: bookingType === "Driver" ? experience : undefined,
    licenseType: bookingType === "Driver" ? licenseType : undefined,
    rating: bookingType === "Driver" ? rating : undefined,
  });

  res.status(201).json({ message: "Booking successful", booking });
});

// ✅ Get user bookings
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id });
  res.json(bookings);
});

// ✅ Admin: Get all bookings
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate("user", "name email");
  res.json(bookings);
});

// ✅ Admin: Update booking status
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  booking.status = req.body.status || booking.status;
  const updated = await booking.save();
  res.json(updated);
});

// ✅ Admin: Delete booking
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  await booking.deleteOne();
  res.json({ message: "Booking deleted" });
});
