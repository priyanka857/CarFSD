import express from "express";
import { addDriver, getDrivers, updateDriverAvailability } from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getDrivers)
  .post(protect, addDriver);

router.route("/:id").put(protect, updateDriverAvailability);

export default router;
