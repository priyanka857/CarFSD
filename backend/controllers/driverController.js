import asyncHandler from "express-async-handler";
import Driver from "../models/driverModel.js";

// @desc Add new driver
// @route POST /api/drivers
export const addDriver = asyncHandler(async (req, res) => {
  const { name, email, phone, licenseNumber } = req.body;

  const driver = await Driver.create({ name, email, phone, licenseNumber });
  res.status(201).json(driver);
});

// @desc Get all drivers
// @route GET /api/drivers
export const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

// @desc Update driver availability
// @route PUT /api/drivers/:id
export const updateDriverAvailability = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (driver) {
    driver.availability = req.body.availability ?? driver.availability;
    await driver.save();
    res.json(driver);
  } else {
    res.status(404);
    throw new Error("Driver not found");
  }
});
