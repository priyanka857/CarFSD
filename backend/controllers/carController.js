import asyncHandler from "express-async-handler";
import Car from "../models/carModel.js";

export const getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
});

export const addCar = asyncHandler(async (req, res) => {
  const { name, model, pricePerKm } = req.body;
  const car = await Car.create({ name, model, pricePerKm });
  res.status(201).json(car);
});
